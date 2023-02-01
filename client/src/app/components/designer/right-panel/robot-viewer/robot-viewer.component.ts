import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import {Interaction} from 'src/app/models/interaction';
import {MicroInteraction} from 'src/app/models/microInteraction';
import {Transition} from 'src/app/models/transition';
import {InteractionManagerService} from 'src/app/services/interaction-manager.service';
import {SimulatorService} from 'src/app/services/simulator.service';
import {VerificationManagerService} from 'src/app/services/verification-manager.service';

@Component({
  selector: 'app-robot-viewer',
  templateUrl: './robot-viewer.component.html',
  styleUrls: []
})
export class RobotViewerComponent implements OnInit {

  nodes: Node[] = [];
  startingNode: Node | undefined = undefined;
  defaultNode: Node | undefined = undefined;

  isPlaying: boolean = false;
  canPlay: boolean = false;
  currentNode: Node | undefined = undefined;
  firstPlay: boolean = false;

  needHumanInput: boolean = false;
  humanReady: boolean = false;
  humanNotReady: boolean = false;

  humanInput: string = '';
  isRobotAsking: boolean = false;

  icon: string = '';

  interval: any;
  showAlert: boolean = true;

  bubbleContent: string = '';

  @Output() showParams: EventEmitter<void> = new EventEmitter<void>();

  constructor(
    private interactionManager: InteractionManagerService,
    private verificationManager: VerificationManagerService,
    private simulator: SimulatorService
  ) { }

  ngOnInit(): void {

    this.verificationManager.violationEmitter.subscribe(v => {
      if (v.length == 0) {
        this.setupInteraction(this.interactionManager.interaction);
        this.canPlay = true;
      } else {
        this.canPlay = false;
      }
    });

    // Listen for 
    this.interactionManager.getUpdatedInteraction.subscribe((interaction: Interaction) => {
      this.isPlaying = false;
      this.canPlay = false;
      //console.log("init setup, canPlay = false");
      this.setupInteraction(interaction);
    });

    this.setupInteraction(this.interactionManager.interaction);

    this.setIcon();

    this.interval = setInterval(() => {
      if (this.isPlaying && !this.needHumanInput) {
        this.updateInteraction();
      } else if (!this.isPlaying) {
        //console.log('paused');
      } else {
        //console.log('need input');
      }

      if (this.currentNode && this.isPlaying) {
        this.simulator.updateCurrentMicroId(this.currentNode.id);
      }
    }, 2000);

  }

  ngOnDestroy(): void {
    clearInterval(this.interval);
  }

  setupInteraction(interaction: Interaction) {

    this.nodes = [];

    interaction.micros.forEach((m: MicroInteraction) => {
      if (m.type) {
        let rt: Transition | undefined = interaction.transitions.find(t => t.id == m.readyTransitionId);
        let nrt: Transition | undefined = interaction.transitions.find(t => t.id == m.notReadyTransitionId);

        let text: string = m.robotText != null ? m.robotText : '';
        if (rt && nrt) {

          let n: Node = new Node(m.id, m.type, rt.secondMicroId, nrt.secondMicroId, text);
          if (n.type == 'Greeter')
            this.startingNode = n;
          this.nodes.push(n);
        } else {
          let n: Node = new Node(m.id, m.type, -1, -1, text);
          this.nodes.push(n);
        }
      }
    });

    this.reset();

    //console.log(this.nodes);
    //console.log(`current node: ${JSON.stringify(this.currentNode)}`);
  }

  updateInteraction() {
    if (this.firstPlay) {
      this.currentNode = this.startingNode;
      this.setIcon();
      this.updateBubbleContent();
      this.firstPlay = false;
      return;
    }

    if (this.humanReady) {
      this.currentNode = this.nodes.find(n => n.id == this.currentNode?.onReady);
      this.needInput();
      //console.log(`ready node: ${JSON.stringify(this.currentNode)}`);
    } else if (this.humanNotReady) {
      this.currentNode = this.nodes.find(n => n.id == this.currentNode?.onNotReady);
      this.needInput();
      //console.log(`not ready node: ${JSON.stringify(this.currentNode)}`);
    } else {
      // TODO Check this
      //this.needHumanInput = true;
      this.needInput();
      //console.log(`need human input`);
      return;
    }

    if (this.currentNode != undefined && this.currentNode.type == 'Ask') {
      this.isRobotAsking = true;
    } else {
      this.isRobotAsking = false;
    }

    this.setIcon();
    this.updateBubbleContent();
  }

  setIcon() {
    if (this.currentNode) {
      switch (this.currentNode.type) {
        case 'Greeter':
        case 'Farewell':
          this.icon = `/assets/robotImages/armRaise.png`;
          break;
        case 'Handoff':
          this.icon = `/assets/robotImages/handoff.png`;
          break;
        default:
          this.icon = `/assets/robotImages/neutral.png`;
          break;
      }
    } else {
      this.icon = '/assets/robotImages/neutral.png';
    }
  }

  updateBubbleContent() {
    if (this.currentNode) {
      this.bubbleContent = this.currentNode.text;
    } else {
      this.bubbleContent = '';
    }
  }

  respond() {
    console.log(this.humanInput);
  }

  needInput() {
    this.humanReady = false;
    this.humanNotReady = false;
    this.needHumanInput = true;
  }

  ready() {
    if (this.needHumanInput) {
      //console.log('ready click');
      this.humanReady = true;
      this.humanNotReady = false;
      this.needHumanInput = false;
    }
  }

  notReady() {
    if (this.needHumanInput) {
      //console.log('not ready click');
      this.humanReady = false;
      this.humanNotReady = true;
      this.needHumanInput = false;
    }
  }

  playPause() {
    if (this.canPlay) {
      this.isPlaying = !this.isPlaying;
    } else {
      alert("You must first verify the model");
    }

    if (this.firstPlay) {
      this.updateInteraction();
    }
  }

  reset() {
    this.currentNode = undefined;
      //this.startingNode;
    this.isPlaying = false;
    this.needHumanInput = true;
    this.humanReady = false;
    this.humanNotReady = false;
    this.firstPlay = true;

    this.icon = '/assets/robotImages/neutral.png';
    this.isRobotAsking = false;

    this.updateBubbleContent();
  }

}

class Node {
  id: number = -1;
  type: string = 'Greeter';
  onReady: number = -1;
  onNotReady: number = -1;
  text: string = '';

  constructor(
    id: number,
    type: string,
    onReady: number,
    onNotReady: number,
    text: string = ''
  ) {
    this.id = id;
    this.type = type;
    this.onReady = onReady;
    this.onNotReady = onNotReady;
    this.text = text;
  }
}
