/*
*/

import { Injectable, Output, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MicroInteraction } from '../models/microInteraction';
import { MicroAnimation } from '../models/microAnimation';

@Injectable({
  providedIn: 'root'
})
export class AnimationService {

  constructor(private http: HttpClient) { }

  async getAnimations(micro: MicroInteraction): Promise<MicroAnimation[]> {
    let res = await this.http.get<MicroAnimation[]>('/api/animations/' + micro.type).toPromise();

    if (res != undefined) {
      return res;
    } else {
      return [];
    }
  }
}