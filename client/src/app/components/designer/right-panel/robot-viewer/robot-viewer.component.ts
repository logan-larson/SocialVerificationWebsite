/*
This is the simulator component. It is responsible for managing the simulation of the designed interaction.
It is also responsible for managing the robot's animations and the robot's speech bubble.
It is fairly complex, but it is mostly just a state machine.
*/

import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Interaction } from 'src/app/models/interaction';
import { MicroInteraction } from 'src/app/models/microInteraction';
import { Transition } from 'src/app/models/transition';
import { InteractionManagerService } from 'src/app/services/interaction-manager.service';
import { SimulatorService } from 'src/app/services/simulator.service';
import { VerificationManagerService } from 'src/app/services/verification-manager.service';
import { MicroAnimation } from 'src/app/models/microAnimation';
import { AnimationService } from 'src/app/services/animation.service';

@Component({
  selector: 'app-robot-viewer',
  templateUrl: './robot-viewer.component.html',
  styleUrls: [],
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
  nextStep: EventEmitter<void> = new EventEmitter<void>();
  showAlert: boolean = true;

  bubbleContent: string = '';

  @Output() showParams: EventEmitter<void> = new EventEmitter<void>();

  constructor(
    private interactionManager: InteractionManagerService,
    private verificationManager: VerificationManagerService,
    private simulator: SimulatorService,
    private animationService: AnimationService
  ) {}

  ngOnInit(): void {
    this.verificationManager.violationEmitter.subscribe((v) => {
      if (v.length == 0) {
        this.setupInteraction(this.interactionManager.interaction);
        this.canPlay = true;
      } else {
        this.canPlay = false;
        this.needHumanInput = false;
      }
    });

    this.interactionManager.getUpdatedInteraction.subscribe(
      (interaction: Interaction) => {
        this.isPlaying = false;
        this.canPlay = false;
        this.needHumanInput = false;
      }
    );

    this.setupInteraction(this.interactionManager.interaction);

    this.setIcon();

    var count = 0;
    this.nextStep.subscribe(() => {
      count++;
      this.updateInteraction();

      if (this.currentNode && this.isPlaying) {
        this.simulator.updateCurrentMicroId(this.currentNode.id);
      }
    });
  }

  setupInteraction(interaction: Interaction) {
    this.nodes = [];

    interaction.micros.forEach(async (m: MicroInteraction) => {
      if (m.type) {
        let rt: Transition | undefined = interaction.transitions.find(
          (t) => t.id == m.readyTransitionId
        );
        let nrt: Transition | undefined = interaction.transitions.find(
          (t) => t.id == m.notReadyTransitionId
        );

        let text: string = m.robotText != null ? m.robotText : '';
        if (rt && nrt) {
          let n: Node = new Node(
            m.id,
            m.type,
            rt.secondMicroId,
            nrt.secondMicroId,
            text
          );
          if (n.type == 'Greeter') {
            this.startingNode = n;
          }
          if (n.type == 'Ask') {
            let paramRes = m.parameterResults;

            if (paramRes) {
              paramRes.forEach((p: any) => {
                if (p.type == 'array') {
                  n.actions = p.arrayResult;
                }
              });
            }
          }
          if (n.type == 'Wait') {
            let paramRes = m.parameterResults;

            if (paramRes) {
              n.waitTime = !paramRes[1].boolResult ? paramRes[0].intResult! : 0;
            }
          }
          if (n.type == 'Handoff') {
            let paramRes = m.parameterResults;

            if (paramRes) {
              n.text = paramRes[0].boolResult! ? 'Here you go!' : '';
            }
          }

          n.animations = await this.animationService.getAnimations(m);

          this.nodes.push(n);
        } else {
          let n: Node = new Node(m.id, m.type, -1, -1, text, 0);

          n.animations = await this.animationService.getAnimations(m);

          this.nodes.push(n);
        }
      }
    });

    this.reset();
  }

  updateInteraction() {
    if (this.firstPlay) {
      this.currentNode = this.startingNode;
      this.animate();
      this.updateBubbleContent();
      this.firstPlay = false;
      return;
    }

    if (this.humanReady) {
      this.currentNode = this.nodes.find(
        (n) => n.id == this.currentNode?.onReady
      );

      this.needInput();
    } else if (this.humanNotReady) {
      this.currentNode = this.nodes.find(
        (n) => n.id == this.currentNode?.onNotReady
      );
      this.needInput();
    } else {
      this.needInput();
      return;
    }

    if (this.currentNode != undefined && this.currentNode.type == 'Ask') {
      this.isRobotAsking = true;
    } else {
      this.isRobotAsking = false;
    }
      
    if (this.currentNode?.type == 'Wait') {
      this.waitForTime(this.currentNode?.waitTime);
    }

    this.updateBubbleContent();

    this.animate();
  }

  async animate() {
    if (!this.currentNode) return;

    if (this.currentNode.type == 'Wait') {
      while (this.currentNode.type == 'Wait') {
        for (let animation of this.currentNode.animations) {
          if (animation.name != this.currentNode.type) return;

          this.icon = animation.imageLocation;
          await new Promise(r => setTimeout(r, 1000));
        }
      }
    } else {
      for (let animation of this.currentNode.animations) {
        if (animation.name != this.currentNode.type) return;

        this.icon = animation.imageLocation;
        await new Promise(r => setTimeout(r, 1000));
      }
    }
  }

  waitForTime(time: number) {
    this.needHumanInput = false;
    setTimeout(() => {
      this.needHumanInput = true;
    }, time * 1000);
  }

  setIcon() {
    if (this.currentNode) {
      switch (this.currentNode.type) {
        case 'Greeter':
        case 'Farewell':
          this.icon = `/assets/croppedRobotImages/armRaise.png`;
          break;
        case 'Handoff':
          this.icon = `/assets/croppedRobotImages/handoff.png`;
          break;
        default:
          this.icon = `/assets/croppedRobotImages/neutral.png`;
          break;
      }
    } else {
      this.icon = '/assets/croppedRobotImages/neutral.png';
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
    if (this.humanInput === '') {
      alert('Please enter a response.');
      return;
    }
    if (this.isRobotAsking && this.needHumanInput) {
      if (this.currentNode) {
        let action = this.currentNode.actions.find(
          (a) =>
            this.lowerAndStripPunct(a.value) ==
            this.lowerAndStripPunct(this.humanInput)
        );
        if (action) {
          if (action.type == 'humanReady') {
            this.humanReady = true;
            this.needHumanInput = false;
          } else if (action.type == 'humanNotReady') {
            this.humanNotReady = true;
            this.needHumanInput = false;
          }
          if (this.isPlaying) this.nextStep.emit();
        } else {
          alert("Hmm ... I don't recognize that.");
        }
        this.humanInput = '';
      }
    }
  }

  lowerAndStripPunct(str: string) {
    return str.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '');
  }

  needInput() {
    this.humanReady = false;
    this.humanNotReady = false;
    this.needHumanInput = true;
  }

  ready() {
    if (this.needHumanInput && this.isPlaying) {
      this.humanReady = true;
      this.humanNotReady = false;
      this.needHumanInput = false;

      this.nextStep.emit();
    }
  }

  notReady() {
    if (this.needHumanInput && this.isPlaying) {
      this.humanReady = false;
      this.humanNotReady = true;
      this.needHumanInput = false;

      this.nextStep.emit();
    }
  }

  playPause() {
    if (this.canPlay) {
      this.isPlaying = !this.isPlaying;

      if (this.firstPlay) {
        this.nextStep.emit();
      }
    } else {
      alert('You must first verify the model');
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

    this.icon = '/assets/croppedRobotImages/neutral.png';
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
  waitTime: number = 0;
  actions: { type: string; value: string }[] = [];
  animations: MicroAnimation[] = [];

  constructor(
    id: number,
    type: string,
    onReady: number,
    onNotReady: number,
    text: string = '',
    waitTime: number = 0,
    actions: { type: string; value: string }[] = [],
    animations: MicroAnimation[] = [],
  ) {
    this.id = id;
    this.type = type;
    this.onReady = onReady;
    this.onNotReady = onNotReady;
    this.text = text;
    this.waitTime = waitTime;
    this.actions = actions;
    this.animations = animations;
  }
}
