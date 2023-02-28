
import { EventEmitter, Injectable } from '@angular/core';
import { Position } from '../models/position';

@Injectable({
  providedIn: 'root'
})
export class CanvasMinimapService {

  viewPosition: Position = new Position(0, 0);

  viewPositionChange: EventEmitter<Position> = new EventEmitter<Position>();

  constructor() { }

  setViewPosition(viewPosition: Position): void {
    this.viewPosition = viewPosition;
    this.viewPositionChange.emit(this.viewPosition);
  }
}