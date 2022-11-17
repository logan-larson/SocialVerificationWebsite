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

  isPlaying: boolean = false;
  currentNode: Node | undefined = undefined;

  needHumanInput: boolean = false;
  humanReady: boolean = false;
  humanNotReady: boolean = false;

  icon: string = '';

  interval: any;
  onSim: boolean = false;


  @Output() showParams: EventEmitter<void> = new EventEmitter<void>();

  constructor(
    private interactionManager: InteractionManagerService,
    private verificationManager: VerificationManagerService,
    private simulator: SimulatorService
  ) { }

  ngOnInit(): void {
    this.onSim = true;
    // Listen for 
    this.interactionManager.getUpdatedInteraction.subscribe((interaction: Interaction) => {
      this.isPlaying = false;
      this.setupInteraction(interaction);
    });

    this.setupInteraction(this.interactionManager.interaction);

    this.setIcon();

    this.interval = setInterval(() => {
      if (this.isPlaying && !this.needHumanInput) {
        this.updateInteraction();
      } else if (!this.isPlaying) {
        console.log('paused');
      } else {
        console.log('need input');
      }

      if (this.currentNode && this.isPlaying) {
        this.simulator.updateCurrentMicroId(this.currentNode.id);
      }
    }, 2000);

  }

  ngOnDestroy(): void {
    console.log("destroy sim");
    this.onSim = false;
    clearInterval(this.interval);
  }

  setupInteraction(interaction: Interaction) {

    if (!this.onSim) return;

    if (this.verificationManager.status != 'verified') {
      alert('The interaction must be verified and have no errors to be simulated');
      this.showParams.emit();
      return;
    }

    this.nodes = [];

    interaction.micros.forEach((m: MicroInteraction) => {
      if (m.type) {
        let rt: Transition | undefined = interaction.transitions.find(t => t.id == m.readyTransitionId);
        let nrt: Transition | undefined = interaction.transitions.find(t => t.id == m.notReadyTransitionId);

        if (rt && nrt) {
          let n: Node = new Node(m.id, m.type, rt.secondMicroId, nrt.secondMicroId);
          if (n.type == 'Greeter')
            this.startingNode = n;
          this.nodes.push(n);
        } else {
          let n: Node = new Node(m.id, m.type, -1, -1);
          this.nodes.push(n);
        }
      }
    });

    this.reset();

    console.log(this.nodes);
    console.log(`current node: ${JSON.stringify(this.currentNode)}`);
  }

  updateInteraction() {
    if (this.humanReady) {
      this.currentNode = this.nodes.find(n => n.id == this.currentNode?.onReady);
      this.needInput();
      console.log(`ready node: ${JSON.stringify(this.currentNode)}`);
    } else if (this.humanNotReady) {
      this.currentNode = this.nodes.find(n => n.id == this.currentNode?.onNotReady);
      this.needInput();
      console.log(`not ready node: ${JSON.stringify(this.currentNode)}`);
    } else {
      // TODO Check this
      //this.needHumanInput = true;
      this.needInput();
      console.log(`need human input`);
      return;
    }

    this.setIcon();
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

  needInput() {
    this.humanReady = false;
    this.humanNotReady = false;
    this.needHumanInput = true;
  }

  ready() {
    if (this.needHumanInput) {
      console.log('ready click');
      this.humanReady = true;
      this.humanNotReady = false;
      this.needHumanInput = false;
    }
  }

  notReady() {
    if (this.needHumanInput) {
      console.log('not ready click');
      this.humanReady = false;
      this.humanNotReady = true;
      this.needHumanInput = false;
    }
  }

  playPause() {
    this.isPlaying = !this.isPlaying;
  }

  reset() {
    this.currentNode = this.startingNode;
    this.isPlaying = false;
    this.needHumanInput = true;
    this.humanReady = false;
    this.humanNotReady = false;
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
