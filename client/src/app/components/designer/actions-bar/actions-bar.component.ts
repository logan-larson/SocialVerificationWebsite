/*
This component displays the macro-actions available
to a user. Similar to the 'File' menu displayed in a
normal program.
*/

import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {Interaction} from 'src/app/models/interaction';
import {Violation} from 'src/app/models/violation';
import {CanvasManagerService} from 'src/app/services/canvas-manager.service';
import { InteractionManagerService } from 'src/app/services/interaction-manager.service';
import { ParameterManagerService } from 'src/app/services/parameter-manager.service';
import { VerificationManagerService } from 'src/app/services/verification-manager.service';

@Component({
  selector: 'app-actions-bar',
  templateUrl: './actions-bar.component.html',
  styles: []
})
export class ActionsBarComponent implements OnInit {

  @ViewChild('interactionFileUpload') fileUpload!: ElementRef;

  isAddingGroup: boolean = false;
  isAddingTransition: boolean = false;

  verifyTooltip: string = 'hidden';
  saveTooltip: string = 'hidden';
  loadTooltip: string = 'hidden';
  clearTooltip: string = 'hidden';
  changeTooltip: string = 'hidden';

  status: string = 'notVerified';
  notVerifiedTooltip: string = 'hidden';
  verifiedTooltip: string = 'hidden';
  errorsTooltip: string = 'hidden';


  constructor(
    private interactionManager: InteractionManagerService,
    private paramManager: ParameterManagerService,
    private verificationManager: VerificationManagerService,
    private canvasManager: CanvasManagerService
  ) { }

  ngOnInit(): void {
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

  saveToFile() {
    let file = "interaction.json";
    let text = JSON.stringify(this.interactionManager.interaction);
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8, ' + encodeURIComponent(text));
    element.setAttribute('download', file);
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }

  loadFromFile() {
    this.fileUpload.nativeElement.click();
  }

  loadFromUpload(event: any) {
    this.interactionManager.loadInteractionFromJSONFile(event.target.files[0]);
  }

  clear() {
    this.interactionManager.clearCanvas();
    this.paramManager.updateCurrentMicro(undefined);
    this.verificationManager.violations = [];
    this.verificationManager.violationEmitter.emit([]);
    this.canvasManager.setViolatingIds([], []);
    this.status = 'notVerified';
    this.verificationManager.status = this.status;
  }

  saveInteractionToLocal() {
    this.interactionManager.saveInteractionToLocal();
  }

  changeTheme() {
    this.canvasManager.changeTheme();
  }
}
