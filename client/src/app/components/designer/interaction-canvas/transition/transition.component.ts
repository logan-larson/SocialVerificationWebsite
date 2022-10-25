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

  firstAnchorPos: Position = new Position();
  secondAnchorPos: Position = new Position();
  middleAnchorPos: Position = new Position();

  fX: string = '0px';
  fY: string = '0px';
  sX: string = '0px';
  sY: string = '0px';
  mX: string = '0px';
  mY: string = '0px';

  x1: string ='0px';
  y1: string ='0px';
  x2: string = '0px';
  y2: string = '0px';

  dFirst: string = '';
  dSecond: string = '';

  lineColor: string = '#000';

  constructor(
    private interactionManager: InteractionManagerService,
    private contextMenu: ContextMenuService,
    private canvasManager: CanvasManagerService
  ) {
    this.canvasManager.getViolatingIds.subscribe(() => {
      this.setHightlightColor();
    });

    // The mouse position should only be emitting changes when the user is adding a transition
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

    this.contextMenu.displayContextMenu('transition', new Position(this.middleAnchorPos.x, this.middleAnchorPos.y), -1, this.transition.id);
  }

  setTransition(t: Transition) {
    this.transition = t;

    if (this.transition) {

      let firstMicro = this.interactionManager.getMicroById(this.transition.firstMicroId);

      if (!firstMicro) return;

      this.setFirstAnchor(firstMicro.position.x, firstMicro.position.y, this.transition.isReady);

      let secondMicro = this.interactionManager.getMicroById(this.transition.secondMicroId);

      if (!secondMicro) return;
      
      this.setSecondAnchor(secondMicro.position.x, secondMicro.position.y);

      this.setMiddleAnchor();

      this.updatePositionStrings();
    }


    /*
    if (this.transition) {
      let firstMicro = this.interactionManager.getMicroById(this.transition.firstMicroId);

      if (firstMicro) {
        this.setFirstOffset(firstMicro, this.transition.isReady);
      }

      let secondMicro = this.interactionManager.getMicroById(this.transition.secondMicroId);

      if (secondMicro) {
        this.setSecondOffset(secondMicro);
      }
    }
    */
  }

  setFirstOffset(m: MicroInteraction, isReady: boolean) {
    this.x1 = (m.anchorPosition.x + 112) + 'px';
    if (isReady) {
      this.y1 = (m.anchorPosition.y + 49) + 'px';
    } else {
      this.y1 = (m.anchorPosition.y + 85) + 'px';
    }
  }

  setSecondOffset(m: MicroInteraction) {
    this.x2 = (m.anchorPosition.x - 14) + 'px';
    this.y2 = (m.anchorPosition.y + 49) + 'px';
  }

  setHightlightColor() {
    if (this.canvasManager.violatingTransitionIds.includes(this.transition.id)) {
      this.lineColor = '#FF0000';
    } else {
      this.lineColor = '#000';
    }
  }

  /* New System */

  setFirstAnchor(x: number, y: number, isReady: boolean) {
    let yOffset: number = isReady ? 49 : 85;

    this.firstAnchorPos = new Position(x + 112, y + yOffset);
  }

  setSecondAnchor(x: number, y: number) {
    this.secondAnchorPos = new Position(x - 14, y + 49);
  }

  setSecondAnchorOnMouse() {
    if (!this.transition.isSet) {
      this.secondAnchorPos = this.mousePos;

      this.setMiddleAnchor();

      this.updatePositionStrings();
    }
  }

  setMiddleAnchor() {
    this.middleAnchorPos = new Position((this.firstAnchorPos.x + this.secondAnchorPos.x) / 2, (this.firstAnchorPos.y + this.secondAnchorPos.y) / 2);
  }

  updatePositionStrings() {
    this.fX = this.firstAnchorPos.x + 'px';
    this.fY = this.firstAnchorPos.y + 'px';
    this.sX = this.secondAnchorPos.x + 'px';
    this.sY = this.secondAnchorPos.y + 'px';
    this.mX = this.middleAnchorPos.x + 'px';
    this.mY = this.middleAnchorPos.y + 'px';
  }
}
