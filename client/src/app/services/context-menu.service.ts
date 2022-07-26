import { Injectable, Output, EventEmitter } from '@angular/core';
import {Position} from '../models/position';

@Injectable({
  providedIn: 'root'
})
export class ContextMenuService {

  type: string = '';
  position: Position = new Position();

  groupId: number = -1;
  microId: number = -1;
  transitionId: number = -1;

  @Output() showContextMenu: EventEmitter<any> = new EventEmitter<any>();
  @Output() hideContextMenuEmitter: EventEmitter<any> = new EventEmitter<any>();

  constructor() { }

  displayContextMenu(type: string, position: Position, groupId: number = -1, microId: number = -1, transitionId: number = -1) {
    this.type = type;
    this.position = position;

    this.groupId = groupId;
    this.microId = microId;
    this.transitionId = transitionId;

    this.showContextMenu.emit();
  }
}
