import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable, Output } from '@angular/core';
import {Violation} from '../models/violation';
import { InteractionManagerService } from './interaction-manager.service';

@Injectable({
  providedIn: 'root'
})
export class VerificationManagerService {

  violations: Violation[] = [];

  @Output() violationEmitter: EventEmitter<Violation[]> = new EventEmitter<Violation[]>();

  constructor(
    private http: HttpClient,
    private interactionManager: InteractionManagerService
  ) { }

  verifyModel(cb: any) {
    this.http
      .post<Violation[]>('/api/verification', this.interactionManager.interaction)
      .subscribe((data: Violation[]) => {
        this.violations = data;
        this.violationEmitter.emit(this.violations);
        cb(data);
      });
  }
}
