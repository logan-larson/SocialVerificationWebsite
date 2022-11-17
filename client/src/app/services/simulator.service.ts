import { EventEmitter, Injectable, Output } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SimulatorService {

  currentMicroId: number = -1;
  
  @Output() getCurrentMicroId: EventEmitter<number> = new EventEmitter<number>();

  constructor() { }

  updateCurrentMicroId(id: number) {
    this.currentMicroId = id;
    this.getCurrentMicroId.emit(this.currentMicroId);
  }
}
