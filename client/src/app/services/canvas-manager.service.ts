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

  @Output() clearCanvas: EventEmitter<any> = new EventEmitter<any>();

  violatingMicroIds: number[] = [];
  violatingTransitionIds: number[] = [];

  canvasOffset: Position = new Position(0, 0);
  canvasScrollOffset: Position = new Position(0, 0);

  // Used when adding a transition for locking onto a micros anchor
  onMicroPos: Position = new Position();

  isDarkMode: boolean = false;
  @Output() getIsDarkMode: EventEmitter<boolean> = new EventEmitter<boolean>();

  // User operation state
  @Output() getModeEmitter: EventEmitter<any> = new EventEmitter();
  mode: string = 'select';

  // Canvas State
  @Output() getZoomLevelEmitter: EventEmitter<any> = new EventEmitter();
  zoomLevel: number = 1;

  // Tutorial
  @Output() getTutorialHiddenEmitter: EventEmitter<boolean> = new EventEmitter();
  tutorialHidden: boolean = false;

  constructor() { }

  setViolatingIds(violatingMicroIds: number[], violatingTransitionIds: number[]) {
    this.violatingMicroIds = violatingMicroIds;
    this.violatingTransitionIds = violatingTransitionIds;
    this.getViolatingIds.emit();
  }

  setTheme(isDarkMode: boolean): void {
    this.isDarkMode = isDarkMode;
    localStorage.setItem('isDarkMode', this.isDarkMode ? 'true' : 'false');
    this.getIsDarkMode.emit(this.isDarkMode);
  }
  
  changeTheme(): void {
    this.isDarkMode = !this.isDarkMode;
    localStorage.setItem('isDarkMode', this.isDarkMode ? 'true' : 'false');
    this.getIsDarkMode.emit(this.isDarkMode);
  }

  setCanvasMode(mode: string): void {
    this.mode = mode;
    this.getModeEmitter.emit();
  }

  setZoomLevel(level: number): void {
    this.zoomLevel = level;
    this.getZoomLevelEmitter.emit();
  }

  toggleTutorial(): void {
    this.tutorialHidden = !this.tutorialHidden;
    localStorage.setItem('tutorialHidden', this.tutorialHidden ? 'true' : 'false');
    this.getTutorialHiddenEmitter.emit(this.tutorialHidden);
  }

  setTutorialHidden(hidden: boolean): void {
    this.tutorialHidden = hidden;
    localStorage.setItem('tutorialHidden', this.tutorialHidden ? 'true' : 'false');
    this.getTutorialHiddenEmitter.emit(this.tutorialHidden);
  }
}
