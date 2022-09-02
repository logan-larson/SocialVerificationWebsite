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
    this.http
      .get('/api/verify')
      .subscribe((res: any) => {
        console.log(res);
      });
    /*
    this.http.get('http://localhost:5000/api/verify', {}).subscribe((res) => {
      console.log(res.toString());
    });
    */
  }
}
