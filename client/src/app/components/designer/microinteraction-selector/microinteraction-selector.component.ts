/*
This component shows the available microinteractions a user can use to build
their interaction. Each microinteraction can be dragged and dropped on the
canvas.
*/

import { Component, OnInit } from '@angular/core';
import { InteractionManagerService } from 'src/app/services/interaction-manager.service';

@Component({
  selector: 'app-microinteraction-selector',
  templateUrl: './microinteraction-selector.component.html',
  styleUrls: []
})
export class MicrointeractionSelectorComponent implements OnInit {

  bgColor: string = 'black';

  greeterTimeoutId: any;
  showGreeterTooltip: boolean = false;

  askTimeoutId: any;
  showAskTooltip: boolean = false;

  remarkTimeoutId: any;
  showRemarkTooltip: boolean = false;

  InstructionTimeoutId: any;
  showInstructionTooltip: boolean = false;

  handoffTimeoutId: any;
  showHandoffTooltip: boolean = false;
  
  answerTimeoutId: any;
  showAnswerTooltip: boolean = false;

  waitTimeoutId: any;
  showWaitTooltip: boolean = false;

  farewellTimeoutId: any;
  showFarewellTooltip: boolean = false;

  constructor(private interactionManager: InteractionManagerService) { }

  ngOnInit(): void {
  }

  dragStart(type: string) {
    this.interactionManager.currentMicroType = type;

    this.hideTooltip(type);
  }

  showTooltip(type: string) {
    switch (type) {
      case 'Greeter':
        this.greeterTimeoutId = setTimeout(() => {
          this.showGreeterTooltip = true;
        }, 750);
        break;
      case 'Ask':
        this.askTimeoutId = setTimeout(() => {
          this.showAskTooltip = true;
        }, 750);
        break;
      case 'Remark':
        this.remarkTimeoutId = setTimeout(() => {
          this.showRemarkTooltip = true;
        }, 750);
        break;
      case 'Instruction':
        this.InstructionTimeoutId = setTimeout(() => {
          this.showInstructionTooltip = true;
        }, 750);
        break;
      case 'Handoff':
        this.handoffTimeoutId = setTimeout(() => {
          this.showHandoffTooltip = true;
        }, 750);
        break;
      case 'Answer':
        this.answerTimeoutId = setTimeout(() => {
          this.showAnswerTooltip = true;
        }, 750);
        break;
      case 'Wait':
        this.waitTimeoutId = setTimeout(() => {
          this.showWaitTooltip = true;
        }, 750);
        break;
      case 'Farewell':
        this.farewellTimeoutId = setTimeout(() => {
          this.showFarewellTooltip = true;
        }, 750);
        break;
    }
  }

  hideTooltip(type: string) {
    switch (type) {
      case 'Greeter':
        clearTimeout(this.greeterTimeoutId);
        this.showGreeterTooltip = false;
        break;
      case 'Ask':
        clearTimeout(this.askTimeoutId);
        this.showAskTooltip = false;
        break;
      case 'Remark':
        clearTimeout(this.remarkTimeoutId);
        this.showRemarkTooltip = false;
        break;
      case 'Instruction':
        clearTimeout(this.InstructionTimeoutId);
        this.showInstructionTooltip = false;
        break;
      case 'Handoff':
        clearTimeout(this.handoffTimeoutId);
        this.showHandoffTooltip = false;
        break;
      case 'Answer':
        clearTimeout(this.answerTimeoutId);
        this.showAnswerTooltip = false;
        break;
      case 'Wait':
        clearTimeout(this.waitTimeoutId);
        this.showWaitTooltip = false;
        break;
      case 'Farewell':
        clearTimeout(this.farewellTimeoutId);
        this.showFarewellTooltip = false;
        break;
    }
  }
}
