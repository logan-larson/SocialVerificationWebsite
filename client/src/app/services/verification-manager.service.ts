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
    console.log("Before: ");
    console.log(JSON.stringify(this.interactionManager.interaction));

    this.http
      .post<string>('/api/verification', JSON.stringify(this.interactionManager.interaction))
      .subscribe((res: any) => {
        //console.log("After: ");
        //console.log(res);
      });
    /*
    this.http
      .get('/api/verify')
      .subscribe((res: any) => {
        console.log(res);
      });
    */
  }
}
