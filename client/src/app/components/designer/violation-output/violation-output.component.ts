import { Component, OnInit } from '@angular/core';
import {Violation} from 'src/app/models/violation';
import {VerificationManagerService} from 'src/app/services/verification-manager.service';

@Component({
  selector: 'app-violation-output',
  templateUrl: './violation-output.component.html',
  styleUrls: []
})
export class ViolationOutputComponent implements OnInit {

  violations: Violation[] = [];

  constructor(
    private verificationManager: VerificationManagerService
  ) {
    this.verificationManager.violationEmitter.subscribe((vs: Violation[]) => {
      this.violations = vs;
    });
  }

  ngOnInit(): void {
    this.violations = this.verificationManager.violations;
  }

}
