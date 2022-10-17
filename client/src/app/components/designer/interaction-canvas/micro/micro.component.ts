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
import { CdkDragEnd } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-micro',
  templateUrl: './micro.component.html',
  styles: [
  ]
})
export class MicroComponent implements OnInit {

  micro: MicroInteraction = new MicroInteraction(1, 0, 0, 'Greeter');

  @ViewChild('microEl') el!: ElementRef;

  x: string = '';
  y: string = '';

  mousePos: Position = new Position();
  onMicro: boolean = false;

  highlightColor: string = 'black';

  constructor(
    private contextMenu: ContextMenuService,
    private canvasManager: CanvasManagerService,
    private interactionManager: InteractionManagerService,
    private parameterManager: ParameterManagerService
  ) {
    this.canvasManager.getViolatingIds.subscribe(n => {
      this.setHightlightColor('black');
    });

    setInterval(() => {
      if (this.interactionManager.isAddingTransition && this.onMicro) {
        //this.mousePos.addPosition(new Position(this.canvasManager.canvasOffset.x, this.canvasManager.canvasOffset.y));
        this.canvasManager.getMousePosition.emit(this.mousePos);
      }
    }, 20);
  }

  ngOnInit(): void {
  }

  setMicro(m: MicroInteraction) {
    this.x = m.x + 'px';
    this.y = m.y + 'px';
    this.micro = m;
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
    if (this.interactionManager.isAddingTransition && this.interactionManager.currentTransition.firstMicroId == this.micro.id) {
      // TODO this.interactionManager.cancelAddingTransition();
      return;
    } 

    // Otherwise if we arent adding a transition, perform transition related functions
    if (!this.interactionManager.isAddingTransition) {

      // If there is no existing readyTransition, init a new transition
      if (this.micro.readyTransition == null) {
        this.interactionManager.setFirstAnchor(this.micro.id, true);
      }
      // Otherwise remove existing readyTransition
      else {
        this.interactionManager.removeTransition(this.micro.readyTransition.id);
      }
    }
  }

  initAddingTransition(event: any, isReady: boolean) {
    event.preventDefault();
    event.stopPropagation();

    if (!this.interactionManager.isAddingTransition) {
      if (isReady && this.micro.readyTransition == null) {
        this.interactionManager.setFirstAnchor(this.micro.id, isReady);
      } else if (!isReady && this.micro.notReadyTransition == null) {
        this.interactionManager.setFirstAnchor(this.micro.id, isReady);
      }
    }

  }

  completeAddingTransition(event: any) {
    event.preventDefault();
    this.interactionManager.setSecondMicroId(this.micro.id);
  }

  setSecondAnchor(isLocked: boolean) {
  }

  cancelAddingTransition(event: any) {
    event.preventDefault();
    event.stopPropagation();
    this.interactionManager.isAddingTransition = false;
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

  /* Reposition micro in canvas */
  droppedMicro(event: CdkDragEnd) {
    let rect = event.source.getRootElement().getBoundingClientRect();
    this.micro.x = rect.x - this.canvasManager.canvasOffset.x + this.canvasManager.canvasScrollOffset.x;
    this.micro.y = rect.y - this.canvasManager.canvasOffset.y + this.canvasManager.canvasScrollOffset.y;
    this.interactionManager.updateMicro(this.micro);
  }

  relayCoords(event: any) {
    this.mousePos = new Position(event.offsetX, event.offsetY);
  }
  
  emitOnMicro(onMicro: boolean) {
    this.onMicro = onMicro;
    this.canvasManager.onMicro.emit(onMicro);
  }

}
