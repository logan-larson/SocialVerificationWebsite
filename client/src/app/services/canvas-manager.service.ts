/*
This service manages the properties of the canvas in which
interactions are displayed.
*/

import { Injectable, Output, EventEmitter } from '@angular/core';
import { Position } from '../models/position';

@Injectable({
  providedIn: 'root'
})
export class CanvasManagerService {

  @Output() updateBtnState: EventEmitter<any> = new EventEmitter();

  @Output() getViolatingIds: EventEmitter<any> = new EventEmitter<any>();

  @Output() getMousePosition: EventEmitter<Position> = new EventEmitter<Position>();

  @Output() onMicro: EventEmitter<boolean> = new EventEmitter<boolean>();

  violatingMicroIds: number[] = [];
  violatingTransitionIds: number[] = [];

  canvasOffset: Position = new Position(0, 0);
  canvasScrollOffset: Position = new Position(0, 0);

  constructor() { }

  setViolatingIds(violatingMicroIds: number[], violatingTransitionIds: number[]) {
    this.violatingMicroIds = violatingMicroIds;
    this.violatingTransitionIds = violatingTransitionIds;
    this.getViolatingIds.emit();
  }
}
