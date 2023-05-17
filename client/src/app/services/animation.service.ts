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

    let url = `/api/animations/${micro.type}?`;

    if (micro.type == 'Greeter') {
      url += `handshake=${micro.parameterResults[1].boolResult}`;
    }

    if (micro.type == 'Remark') {
      url += `gesture=${micro.parameterResults[1].boolResult}`;
    }

    let res = await this.http.get<MicroAnimation[]>(url).toPromise();

    if (res != undefined) {

      if (micro.type == 'Greeter' && !micro.parameterResults[1].boolResult) {
        return res.slice(0, 1);
      }

      if (micro.type == 'Remark' && !micro.parameterResults[1].boolResult) {
        return res.slice(0, 1);
      }

      return res;
    } else {
      return [];
    }
  }
}