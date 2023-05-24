/*
This component is responsible for displaying the violations of the model.
When the model is verified, the violations are displayed in this component.
It also has a button to verify the model and a status indicator.
*/

import { Component, OnInit } from '@angular/core';
import {Violation} from 'src/app/models/violation';
import {Interaction} from 'src/app/models/interaction';
import {VerificationManagerService} from 'src/app/services/verification-manager.service';
import { InteractionManagerService } from 'src/app/services/interaction-manager.service';

@Component({
  selector: 'app-violation-output',
  templateUrl: './violation-output.component.html',
  styleUrls: []
})
export class ViolationOutputComponent implements OnInit {

  violations: Violation[] = [];

  status: string = 'notVerified';
  notVerifiedTooltip: string = 'hidden';
  verifiedTooltip: string = 'hidden';
  errorsTooltip: string = 'hidden';
  verifyTooltip: string = 'hidden';

  constructor(
    private verificationManager: VerificationManagerService,
    private interactionManager: InteractionManagerService
  ) {
    this.verificationManager.violationEmitter.subscribe((vs: Violation[]) => {
      // vs.forEach(v => v.help = "This is a help message to demonstrate the drop down");
      
      this.violations = vs;
    });
  }

  ngOnInit(): void {
    this.violations = this.verificationManager.violations;

    this.interactionManager.getUpdatedInteraction.subscribe((inter: Interaction) => {
      this.status = 'notVerified';
      this.verificationManager.status = this.status;
    });
  }

  verifyModel() {
    this.verificationManager.verifyModel((violations: any) => {
      if (violations.length > 0) {
        this.status = 'errors';
      } else {
        this.status = 'verified';
      }
      this.verificationManager.status = this.status;
    });
  }
}
