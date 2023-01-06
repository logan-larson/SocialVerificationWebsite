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
import {CdkDragMove} from '@angular/cdk/drag-drop';

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

  midDragging: boolean = false;
  midDist: Position = new Position();
  oldMidPos: Position = new Position();

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

    setInterval(() => {
      if (this.midDragging) {
        this.setMiddleAnchor(true, this.midDist);
        this.updatePositionStrings(false);
      }
    }, 20);
    
    this.interactionManager.dragDistance.subscribe((dist: Position) => {
      if (this.transition.firstMicroId === this.interactionManager.currentDragMid) { // If the transitions first micro is getting dragged, update its position
        let firstMicro = this.interactionManager.getMicroById(this.transition.firstMicroId);
        if (!firstMicro) return;
        this.setFirstAnchor(firstMicro.position.x + dist.x, firstMicro.position.y + dist.y, this.transition.isReady);
      }
      if (this.transition.secondMicroId === this.interactionManager.currentDragMid) { // Same thing for second micro
        let secondMicro = this.interactionManager.getMicroById(this.transition.secondMicroId);
        if (!secondMicro) return;
        this.setSecondAnchor(secondMicro.position.x + dist.x, secondMicro.position.y + dist.y);
      }

      if (this.transition.midPos.x === 0 && this.transition.midPos.y === 0) {
        this.setMiddleAnchor(false);
      }
      this.updatePositionStrings();
    });

    this.interactionManager.resetMidpoint.subscribe((tid: number) => {
      if (tid == this.transition.id) {
        this.transition.midPos = new Position();
        this.setMiddleAnchor(false);
        this.updatePositionStrings(true);

        this.contextMenu.hideContextMenu.emit(false);
      }
    });
  }

  showContextMenu(event: any) {
    if (this.contextMenu.type != '') {
      return;
    }

    event.preventDefault();

    let pos = new Position(this.middleAnchorPos.x, this.middleAnchorPos.y);

    this.contextMenu.displayContextMenu('transition', pos, -1, this.transition.id);
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

      if (this.transition.midPos.x === 0 && this.transition.midPos.y === 0) {
        this.setMiddleAnchor(false);
      } else {
        this.oldMidPos = new Position();
        this.setMiddleAnchor(true, this.transition.midPos);
      }

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


  /* Dragging the middle anchor */
  midDragStart(event: any) {
    this.midDist = new Position();
    this.oldMidPos = this.middleAnchorPos;
    this.midDragging = true;
  }

  midDragMove(event: CdkDragMove) {
    this.midDist = new Position(event.distance.x, event.distance.y);
  }

  midDragEnd(event: any) {
    this.midDist = new Position();
    this.midDragging = false;
  }

  /* Old system */

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

    this.firstAnchorPos = new Position(x + 127, y + yOffset);
  }

  setSecondAnchor(x: number, y: number) {
    this.secondAnchorPos = new Position(x - 32, y + 49);
  }

  setSecondAnchorOnMouse() {
    if (!this.transition.isSet) {

      this.secondAnchorPos = this.mousePos;

      this.setMiddleAnchor(false);

      this.updatePositionStrings();
    }
  }

  setMiddleAnchor(isDragged: boolean, dist: Position = new Position(0, 0)) {
    if (isDragged) {
      this.middleAnchorPos = new Position(this.oldMidPos.x + dist.x, this.oldMidPos.y + dist.y);
      this.transition.midPos = this.middleAnchorPos;
    } else {
      this.middleAnchorPos = new Position(((this.firstAnchorPos.x + this.secondAnchorPos.x) / 2) + dist.x, ((this.firstAnchorPos.y + this.secondAnchorPos.y) / 2) + dist.y);
      this.transition.midPos = new Position();
    }
  }

  updatePositionStrings(useMid: boolean = true) {
    this.fX = this.firstAnchorPos.x + 'px';
    this.fY = this.firstAnchorPos.y + 'px';
    this.sX = this.secondAnchorPos.x + 'px';
    this.sY = this.secondAnchorPos.y + 'px';
    if (useMid) {
      this.mX = this.middleAnchorPos.x - 7 + 'px';
      this.mY = this.middleAnchorPos.y - 7 + 'px';
    }

    let bezierOffset: number = this.firstAnchorPos.x - this.secondAnchorPos.x;
    bezierOffset = bezierOffset > 61 ? bezierOffset : 60;
    bezierOffset = bezierOffset < 400 ? bezierOffset : 401;
    let midOffset: number = 0;

    if (this.firstAnchorPos.x < this.secondAnchorPos.x) {
      this.dFirst = `M ${this.firstAnchorPos.x} ${this.firstAnchorPos.y}
                     C ${this.firstAnchorPos.x + bezierOffset} ${this.firstAnchorPos.y},
                       ${this.middleAnchorPos.x - midOffset} ${this.middleAnchorPos.y},
                       ${this.middleAnchorPos.x} ${this.middleAnchorPos.y}`;

      this.dSecond = `M ${this.middleAnchorPos.x} ${this.middleAnchorPos.y}
                      C ${this.middleAnchorPos.x + midOffset} ${this.middleAnchorPos.y},
                        ${this.secondAnchorPos.x - bezierOffset} ${this.secondAnchorPos.y},
                        ${this.secondAnchorPos.x} ${this.secondAnchorPos.y}`;
    } else {
      this.dFirst = `M ${this.firstAnchorPos.x} ${this.firstAnchorPos.y}
                     C ${this.firstAnchorPos.x + bezierOffset} ${this.firstAnchorPos.y},
                       ${this.middleAnchorPos.x + midOffset} ${this.middleAnchorPos.y},
                       ${this.middleAnchorPos.x} ${this.middleAnchorPos.y}`;

      this.dSecond = `M ${this.middleAnchorPos.x} ${this.middleAnchorPos.y}
                      C ${this.middleAnchorPos.x - midOffset} ${this.middleAnchorPos.y},
                        ${this.secondAnchorPos.x - bezierOffset} ${this.secondAnchorPos.y},
                        ${this.secondAnchorPos.x} ${this.secondAnchorPos.y}`;
    }

  }
}
