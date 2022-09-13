import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { InteractionManagerService } from './interaction-manager.service';

@Injectable({
  providedIn: 'root'
})
export class VerificationManagerService {

  constructor(
    private http: HttpClient,
    private interactionManager: InteractionManagerService
  ) { }

  verifyModel() {
    this.http
      .post<JSON>('/api/verification', this.interactionManager.interaction)
      .subscribe((data: JSON) => {
        console.log("Violations: ");
        console.log(data);
      });
  }
}
