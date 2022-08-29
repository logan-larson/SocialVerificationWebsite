import {HttpClient} from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class VerificationManagerService {

  constructor(
    private http: HttpClient
  ) { }

  verifyModel() {
    this.http.get('/api/verify', {}).subscribe((res) => {
      console.log(res.toString());
    });
  }
}
