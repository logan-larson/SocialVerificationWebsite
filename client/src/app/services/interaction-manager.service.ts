/*
This service manages the current interaction being built.
*/

import { EventEmitter, Injectable, Output } from '@angular/core';
import { Interaction } from '../models/interaction';
import { MicroInteraction } from '../models/microInteraction';
import { Parameter } from '../models/parameter';
import { MicroType } from '../models/microType';
import { ParameterResult } from '../models/parameterResult';
import { Transition } from '../models/transition';
import { HttpClient } from '@angular/common/http';
import { Position } from '../models/position';
import { ParameterManagerService } from '../services/parameter-manager.service';

@Injectable({
  providedIn: 'root'
})
export class InteractionManagerService {

  interaction: Interaction = new Interaction();

  currentTransition: Transition = new Transition();
  
  // Transitions listen to the event emitter and if the currentDragMid matches one of their anchors they move accordingly
  currentDragMid: number = -1;
  @Output() dragDistance: EventEmitter<Position> = new EventEmitter<Position>();

  isAddingTransition: boolean = false;

  currentMicroType: string = '';

  @Output() getUpdatedInteraction: EventEmitter<Interaction> = new EventEmitter<Interaction>();
  @Output() getUpdatedMicro: EventEmitter<MicroInteraction> = new EventEmitter<MicroInteraction>();
  @Output() initTransition: EventEmitter<Transition> = new EventEmitter<Transition>();
  @Output() cancelTransition: EventEmitter<Transition> = new EventEmitter<Transition>();

  @Output() resetMidpoint: EventEmitter<number> = new EventEmitter<number>();

  constructor(private http: HttpClient, private paramManager: ParameterManagerService) { }

  /* Micro related CRUD functions */

  updateMicro(micro: MicroInteraction) {
    let ms: MicroInteraction[] = this.interaction.micros.filter((x: MicroInteraction) => x.id != micro.id);

    ms.push(micro);

    this.interaction.micros = ms;

    this.getUpdatedInteraction.emit(this.interaction);
  }

  getMicroById(mid: number) {
    let m: MicroInteraction | undefined = this.interaction.micros.find((x: MicroInteraction) => x.id === mid);

    return m;
  }

  async addMicro(x: number, y: number): Promise<MicroInteraction | null> {

    let mt: MicroType | undefined = await this.http.get<MicroType>(`/api/microtypes/${this.currentMicroType}`).toPromise();


    //let trackedMicroTypes: MicroType[] = getTrackedMicroTypes();

    let params: Parameter[] = [];

    //let mt: MicroType | undefined = trackedMicroTypes.find((m: MicroType) => m.type === this.currentMicroType);
    let dftParamRes: ParameterResult[] | undefined = undefined;

    if (mt) {
      dftParamRes = await this.http.get<ParameterResult[]>(`/api/paramres/${mt.type}`).toPromise();
      params = mt.parameters;
    }

    dftParamRes = dftParamRes == undefined ? [] : dftParamRes;

    let m: MicroInteraction = new MicroInteraction(this.interaction.microIdCounter++, new Position(x, y), this.currentMicroType, params, new Position(x, y), dftParamRes);

    this.interaction.micros.push(m);

    this.getUpdatedInteraction.emit(this.interaction);

    this.paramManager.updateCurrentMicro(m);

    return m;
  }

  removeMicro(microId: number):void {

    let m = this.getMicroById(microId);
    if (m == undefined) {
      console.log("no such micro");
    }

    // Remove transitions associated with the microId
    let ts: Transition[] = this.interaction.transitions.filter((x: Transition) => x.firstMicroId == microId || x.secondMicroId == microId);

    //this.interaction.transitions = ts;
    ts.forEach(t => this.removeTransition(t.id));

    // Remove the micro from the micros list
    let ms: MicroInteraction[] = this.interaction.micros.filter((x: MicroInteraction) => x.id != microId);

    this.interaction.micros = ms;

    if (this.interaction.micros.length == 0) {
      this.interaction.microIdCounter = 0;
    }

    this.getUpdatedInteraction.emit(this.interaction);
  }

  /* Transition related CRUD functions */

  removeTransition(tid: number) {

    // Get the trans in question for later use
    let t: Transition | undefined = this.interaction.transitions.find((x: Transition) => x.id == tid);

    // Filter out the specified trans
    let ts: Transition[] = this.interaction.transitions.filter((x: Transition) => x.id != tid);

    // Set the new transitions
    this.interaction.transitions = ts;

    // Reset id counter if at 0
    if (this.interaction.transitions.length == 0) {
      this.interaction.transitionIdCounter = 0;
    }

    // Then find the micro in which it originates
    let m = this.interaction.micros.find(micro => t != undefined && micro.id === t.firstMicroId);
    if (m) {

      // Reset anchor based on transition state
      if (t && t.isReady) {
        m.readyTransitionId = -1;
      } else {
        m.notReadyTransitionId = -1;
      }

      this.updateMicro(m);
    }

    this.getUpdatedInteraction.emit(this.interaction);
  }

  setFirstAnchor(mid: number, isReady: boolean) {
    this.currentTransition = new Transition(this.interaction.transitionIdCounter, isReady, mid, -1, false);

    this.interaction.transitions.push(this.currentTransition);
    this.interaction.transitionIdCounter++;

    this.initTransition.emit(this.currentTransition);

    this.isAddingTransition = true;

    let m = this.interaction.micros.find(micro => micro.id === mid);
    if (m) {
      if (isReady) {
        m.readyTransitionId = this.currentTransition.id;
      } else {
        m.notReadyTransitionId = this.currentTransition.id;
      }
      this.getUpdatedInteraction.emit(this.interaction);
    }
  }

  setSecondAnchor(mid: number) {

    // Check that this is going to be a unique transition
    // This is unnecessary now because its impossible for a user to add duplicate transitions
    /*
    let dup = this.interaction.transitions.find((t: Transition) => t.firstMicroId == this.currentTransition.firstMicroId && t.secondMicroId == mid);

    if (dup != undefined) {
      return;
    }
    */

    this.currentTransition.secondMicroId = mid;
    this.currentTransition.isSet = true;
    this.isAddingTransition = false;

    //this.interaction.transitions.push(this.currentTransition);

    this.getUpdatedInteraction.emit(this.interaction);
  }

  cancelAddingTransition() {
    this.isAddingTransition = false;

    let m = this.interaction.micros.find(micro => micro.id === this.currentTransition.firstMicroId);
    if (m) {
      if (this.currentTransition.isReady) {
        m.readyTransitionId = -1;
      } else {
        m.notReadyTransitionId = -1;
      }

      this.updateMicro(m);
    }

    this.removeTransition(this.currentTransition.id);

    this.currentTransition = new Transition();
  }

  updateTransition(transition: Transition) {
    let ts: Transition[] = this.interaction.transitions.filter((x: Transition) => x.id != transition.id);

    ts.push(transition);

    this.interaction.transitions = ts;

    this.getUpdatedInteraction.emit(this.interaction);
  }

  /* Loading from file on disk */

  async loadInteractionFromJSONFile(file: File) {
    let t: string = await file.text();

    this.interaction = new Interaction(t);

    this.getUpdatedInteraction.emit(this.interaction);
  }

  /* Save and load interaction from local storage */

  loadInteractionFromLocal(): void {
    let interactionString = localStorage.getItem('interaction');

    if (interactionString) {
      this.interaction = new Interaction(interactionString);
    } else {
      this.interaction = new Interaction();
    }

    this.getUpdatedInteraction.emit(this.interaction);
  }

  saveInteractionToLocal() {
    localStorage.setItem('interaction', JSON.stringify(this.interaction));
  }

  /* New interaction */

  clearCanvas() {
    this.interaction = new Interaction();

    this.getUpdatedInteraction.emit(this.interaction);

    this.saveInteractionToLocal();
  }

}
