/*
This component is placed on a group to add
meaning to a group. It is actions that are performed by
the robot when the group is executed.
*/

import { Component, OnInit, Input, ElementRef, ViewChild } from '@angular/core';
import { MicroInteraction } from 'src/app/models/microInteraction';
import { ContextMenuService } from 'src/app/services/context-menu.service';
import { Position } from 'src/app/models/position';
import { ParameterManagerService } from 'src/app/services/parameter-manager.service';
import { CanvasManagerService } from 'src/app/services/canvas-manager.service';
import { InteractionManagerService } from 'src/app/services/interaction-manager.service';
import { CdkDragEnd, CdkDragMove, CdkDragStart } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-micro',
  templateUrl: './micro.component.html',
  styles: [
  ]
})
export class MicroComponent implements OnInit {

  micro: MicroInteraction = new MicroInteraction(1, new Position(0, 0), 'Greeter');

  @ViewChild('microEl') el!: ElementRef;

  x: string = '';
  y: string = '';

  isDragging: boolean = false;
  dragDistance: Position = new Position();
  microPos: Position = new Position();

  highlightColor: string = 'black';
  isViolating: boolean = false;

  bgColor: string = 'rgb(209 213 219)';

  constructor(
    private contextMenu: ContextMenuService,
    private canvasManager: CanvasManagerService,
    private interactionManager: InteractionManagerService,
    private parameterManager: ParameterManagerService
  ) {
    this.canvasManager.getViolatingIds.subscribe(n => {
      this.setHightlightColor('black');
      if (this.canvasManager.violatingMicroIds.includes(this.micro.id)) {
        this.isViolating = true;
      } else {
        this.isViolating = false;
      }
    });

    // While adding a transition if cursor is on a micro, set

  }

  ngOnInit(): void {
    // While user is dragging the micro, update the current drag distance so accompanied transitions can follow 
    setInterval(() => {
      if (this.isDragging) {
        this.interactionManager.dragDistance.emit(this.dragDistance);
        /*
        this.micro.anchorPosition.x = this.microPos.x;
        this.micro.anchorPosition.y = this.microPos.y;
        this.interactionManager.updateMicro(this.micro);
        */
      }
    }, 20);
  }

  setMicro(m: MicroInteraction) {
    this.x = m.position.x + 'px';
    this.y = m.position.y + 'px';
    this.micro = m;
    
    this.setBgColor();
  }

  /* Show microinteraction's parameter options in the interaction options pane */
  clickMicro(event: any) {
    event.preventDefault();

    this.parameterManager.updateCurrentMicro(this.micro);
  }

  /* Show options menu when right-clicked */
  showContextMenu(event: any) {
    event.preventDefault();

    let xPos = this.el.nativeElement.getBoundingClientRect().x;
    let yPos = this.el.nativeElement.getBoundingClientRect().y;

    let canvasPos: Position = this.canvasManager.canvasOffset;

    let xOffset = xPos - canvasPos.x;
    let yOffset = yPos - canvasPos.y;

    this.contextMenu.displayContextMenu('micro', new Position(xOffset + event.offsetX, yOffset + event.offsetY), this.micro.id);
  }

  /* Transition related methods */

  clickReadyAnchor(event: any) {
    event.preventDefault();
    event.stopPropagation();

    // If in process of adding transition and this is the original anchor, stop adding transition
    // Otherwise if in process of adding transition do nothing
    if (this.interactionManager.isAddingTransition && this.interactionManager.currentTransition.firstMicroId == this.micro.id) {
      this.interactionManager.cancelAddingTransition();
      return;
    }

    // Otherwise if we arent adding a transition, perform transition related functions
    if (!this.interactionManager.isAddingTransition) {

      // If there is no existing readyTransition, init a new transition
      if (this.micro.readyTransitionId == -1) {
        this.interactionManager.setFirstAnchor(this.micro.id, true);
      }
      // Otherwise remove existing readyTransition
      else {
        this.interactionManager.removeTransition(this.micro.readyTransitionId);
      }
    }
  }

  clickNotReadyAnchor(event: any) {
    event.preventDefault();
    event.stopPropagation();

    // If in process of adding transition and this is the original anchor, stop adding transition
    // Otherwise if in process of adding transition do nothing
    if (this.interactionManager.isAddingTransition && this.interactionManager.currentTransition.firstMicroId == this.micro.id) {
      this.interactionManager.cancelAddingTransition();
      return;
    }

    // Otherwise if we arent adding a transition, perform transition related functions
    if (!this.interactionManager.isAddingTransition) {

      // If there is no existing notReadyTransition, init a new transition
      if (this.micro.notReadyTransitionId == -1) {
        this.interactionManager.setFirstAnchor(this.micro.id, false);
      }
      // Otherwise remove existing notReadyTransition
      else {
        this.interactionManager.removeTransition(this.micro.notReadyTransitionId);
      }
    }
  }

  clickSecondAnchor(event: any) {
    event.preventDefault();
    event.stopPropagation();

    if (this.interactionManager.isAddingTransition && this.interactionManager.currentTransition.firstMicroId != -1) {
      this.interactionManager.setSecondAnchor(this.micro.id);
    }
  }

  setSecondAnchor(state: boolean) {
    if (state) {
      this.canvasManager.onMicro = true;
      if (this.interactionManager.isAddingTransition) {
        let pos: Position = new Position((this.micro.position.x - 14), (this.micro.position.y + 49));
        this.canvasManager.getMousePosition.emit(pos);
      }
    } else {
      this.canvasManager.onMicro = false;
    }
  }

  setHightlightColor(val: string) {
    if (this.interactionManager.isAddingTransition) {
      this.highlightColor = val;
    } else if (this.canvasManager.violatingMicroIds.includes(this.micro.id)) {
      this.highlightColor = 'red';
    } else {
      this.highlightColor = 'black';
    }
  }

  setBgColor() {
    /*
    switch (this.micro.type) {
      case 'Greeter':
        this.bgColor = 'rgb(34 197 94)';
        break;
      case 'Ask':
        this.bgColor = 'rgb(96 165 250)';
        break;
      case 'Remark':
        this.bgColor = 'rgb(244 114 182)';
        break;
      case 'Instruction':
        this.bgColor = 'rgb(252 211 77)';
        break;
      case 'Handoff':
        this.bgColor = 'rgb(100 116 139)';
        break;
      case 'Answer':
        this.bgColor = 'rgb(147 51 234)';
        break;
      case 'Wait':
        this.bgColor = 'rgb(251 146 60)';
        break;
      case 'Farewell':
        this.bgColor = 'rgb(248 113 113)';
        break;
      default:
        this.bgColor = 'rgb(0 0 0)';

    }
    */
  }

  /* Reposition micro in canvas */

  startDrag(event: CdkDragStart) {
    let rect = event.source.getRootElement().getBoundingClientRect();

    // Set the local position on drag start
    this.microPos.x = rect.x - this.canvasManager.canvasOffset.x + this.canvasManager.canvasScrollOffset.x;
    this.microPos.y = rect.y - this.canvasManager.canvasOffset.y + this.canvasManager.canvasScrollOffset.y;

    //this.interactionManager.updateMicro(this.micro);
    this.dragDistance = new Position();
    this.interactionManager.currentDragMid = this.micro.id;
    this.isDragging = true;
  }

  dragMicro(event: CdkDragMove) {
    // Update the micro position based on distance traveled
    //this.microPos.x += event.distance.x;
    //this.microPos.y += event.distance.y;
    this.dragDistance = new Position(event.distance.x, event.distance.y);
  }

  droppedMicro(event: CdkDragEnd) {
    // Set the anchor position on drag start
    this.dragDistance = new Position();
    this.interactionManager.currentDragMid = -1;
    this.isDragging = false;


    let rect = event.source.getRootElement().getBoundingClientRect();
    this.micro.position.x = rect.x - this.canvasManager.canvasOffset.x + this.canvasManager.canvasScrollOffset.x;
    this.micro.position.y = rect.y - this.canvasManager.canvasOffset.y + this.canvasManager.canvasScrollOffset.y;

    this.micro.anchorPosition.x = rect.x - this.canvasManager.canvasOffset.x + this.canvasManager.canvasScrollOffset.x;
    this.micro.anchorPosition.y = rect.y - this.canvasManager.canvasOffset.y + this.canvasManager.canvasScrollOffset.y;
    this.interactionManager.updateMicro(this.micro);
  }
}
