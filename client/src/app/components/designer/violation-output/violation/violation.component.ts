/*
This component is used to display a single violation in the violation output component.
Each violation has a help message that can be toggled on and off.
*/

import { Component, OnInit, Input } from '@angular/core';
import {Violation} from 'src/app/models/violation';
import {CanvasManagerService} from 'src/app/services/canvas-manager.service';

@Component({
  selector: 'app-violation',
  templateUrl: './violation.component.html',
  styles: [
  ]
})
export class ViolationComponent implements OnInit {

  @Input() violation: Violation = new Violation();
  showHelp: boolean = false;

  violationHelp: string = 'hidden';

  constructor(
    private canvasManager: CanvasManagerService
  ) { }

  ngOnInit(): void {
  }

  showViolations() {
    this.canvasManager.setViolatingIds(this.violation.violatingMicroIds, this.violation.violatingTransitionIds);
  }

  hideViolations() {
    this.canvasManager.setViolatingIds([], []);
  }

  changeViolationHelp() {
    if (this.violationHelp == 'hidden') {
      this.violationHelp = 'visible';
    } else {
      this.violationHelp = 'hidden';
    }
  }
}
