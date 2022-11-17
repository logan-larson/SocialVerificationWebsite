import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import {Interaction} from 'src/app/models/interaction';
import {MicroInteraction} from 'src/app/models/microInteraction';
import {InteractionManagerService} from 'src/app/services/interaction-manager.service';
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


  @Output() showParams: EventEmitter<void> = new EventEmitter<void>();

  constructor(
    private interactionManager: InteractionManagerService,
    private verificationManager: VerificationManagerService
  ) { }

  ngOnInit(): void {
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
    }, 2000);

  }

  ngOnDestroy(): void {
    console.log("destroy sim");
    clearInterval(this.interval);
  }

  setupInteraction(interaction: Interaction) {
    if (this.verificationManager.status != 'verified') {
      alert('The interaction must be verified and have no errors to be simulated');
      this.showParams.emit();
      return;
    }

    interaction.micros.forEach((m: MicroInteraction) => {
      if (m.type) {
        let n: Node = new Node(m.id, m.type, m.readyTransitionId, m.notReadyTransitionId);
        if (n.type == 'Greeter')
          this.startingNode = n;
        this.nodes.push(n);
      }
    });

    this.reset();

    console.log(`nodes: ${JSON.stringify(this.nodes)}`);
    console.log(`current node: ${JSON.stringify(this.currentNode)}`);
  }

  updateInteraction() {
    if (this.humanReady) {
      this.currentNode = this.nodes.find(n => n.id == this.currentNode?.onReady);
      console.log(`ready node: ${JSON.stringify(this.currentNode)}`);
    } else if (this.humanNotReady) {
      this.currentNode = this.nodes.find(n => n.id == this.currentNode?.onNotReady);
      console.log(`not ready node: ${JSON.stringify(this.currentNode)}`);
    } else {
      // TODO Check this
      this.needHumanInput = true;
      console.log(`need human input`);
      return;
    }

    this.setIcon();
  }

  setIcon() {
    if (this.currentNode) {
      this.icon = `/assets/robotImages/${this.currentNode.type}.png`;
    } else {
      this.icon = '/assets/robotImages/neutralRobot.png';
    }
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

  constructor(
    id: number,
    type: string,
    onReady: number,
    onNotReady: number
  ) {
    this.id = id;
    this.type = type;
    this.onReady = onReady;
    this.onNotReady = onNotReady;
  }
}
