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

}
