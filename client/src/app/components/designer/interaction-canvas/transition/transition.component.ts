/*
This component displays a transition between two microinteractions.
*/

import { Component, OnInit } from '@angular/core';
import { Transition } from 'src/app/models/transition';
import { Position } from 'src/app/models/position';
import { InteractionManagerService } from 'src/app/services/interaction-manager.service';
import { ContextMenuService } from 'src/app/services/context-menu.service';
import {MicroInteraction} from 'src/app/models/microInteraction';
import {CanvasManagerService} from 'src/app/services/canvas-manager.service';

@Component({
  selector: 'app-transition',
  templateUrl: './transition.component.html',
  styles: [
  ]
})
export class TransitionComponent implements OnInit {

  transition: Transition = new Transition();

  mousePos: Position = new Position();

  isReady: boolean = false;
  isNotReady: boolean = false;

  isLine: boolean = true;

  width: number = 96;
  height: number = 176;
  arrowLength: number = 15;

  x1: string ='0px';
  y1: string ='0px';
  x2: string = '0px';
  y2: string = '0px';
  d: string = '';

  lineColor: string = '#FF0000';

  conditionsX: string = '0px';
  conditionsY: string = '0px';

  constructor(
    private interactionManager: InteractionManagerService,
    private contextMenu: ContextMenuService,
    private canvasManager: CanvasManagerService
  ) {
    this.canvasManager.getViolatingIds.subscribe(() => {
      this.setHightlightColor();
    });

    this.canvasManager.getMousePosition.subscribe((mp: Position) => {
      this.mousePos = mp;
      this.setSecondAnchorOnMouse();
    });
  }

  ngOnInit(): void {
  }

  showContextMenu(event: any) {
    if (this.contextMenu.type != '') {
      return;
    }

    event.preventDefault();

    let xNum: number = parseInt(this.conditionsX.substring(0, this.conditionsX.length - 2));
    let yNum: number = parseInt(this.conditionsY.substring(0, this.conditionsY.length - 2));

    this.contextMenu.displayContextMenu('transition', new Position(xNum + 50, yNum + 25), -1, this.transition.id);
  }

  setTransition(t: Transition) {
    this.transition = t;

    if (this.transition) {
      let firstMicro = this.interactionManager.getMicroById(this.transition.firstMicroId);

      if (firstMicro) {
        this.setFirstOffset(firstMicro, this.transition.isReady);
      }

      let secondMicro = this.interactionManager.getMicroById(this.transition.secondMicroId);

      if (secondMicro) {
        this.setSecondOffset(secondMicro);
      } else {
        this.setSecondAnchorOnMouse();
      }
    }
  }

  setFirstOffset(m: MicroInteraction, isReady: boolean) {
    this.x1 = (m.x + 112) + 'px';
    if (isReady) {
      this.y1 = (m.y + 49) + 'px';
    } else {
      this.y1 = (m.y + 85) + 'px';
    }
  }

  setSecondOffset(m: MicroInteraction) {
    this.x2 = (m.x - 14) + 'px';
    this.y2 = (m.y + 49) + 'px';
  }

  setSecondAnchorOnMouse() {
    this.x2 = this.mousePos.x + 'px';
    this.y2 = this.mousePos.y + 'px';
  }

  setSelfOffsets(m: MicroInteraction) {
    let NOutX = m.x + this.width / 3
    let EInY = m.y + this.height / 3

    this.conditionsX = (m.x - 100) + "px";
    this.conditionsY = (m.y - 50) + "px";

    this.d = 'M ' + NOutX + ' ' + m.y +
      ' C ' + m.x + ' ' + (m.y - 50) + ', ' +
      (m.x - 60) + ' ' + m.y + ', ' + (m.x - 10) + ' ' + (EInY - 15);
  }

  updateTransition() {
    this.transition.ready = this.isReady;
    this.transition.notReady = this.isNotReady;
    this.interactionManager.updateTransition(this.transition);
  }

  setHightlightColor() {
    if (this.canvasManager.violatingTransitionIds.includes(this.transition.id)) {
      this.lineColor = '#FF0000';
    } else {
      this.lineColor = '#000';
    }
  }

}
