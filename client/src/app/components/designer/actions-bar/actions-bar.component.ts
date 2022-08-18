import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CanvasManagerService } from 'src/app/services/canvas-manager.service';
import {ParameterManagerService} from 'src/app/services/parameter-manager.service';

@Component({
  selector: 'app-actions-bar',
  templateUrl: './actions-bar.component.html',
  styles: []
})
export class ActionsBarComponent implements OnInit {

  @ViewChild('interactionFileUpload') fileUpload!: ElementRef;

  isAddingGroup: boolean = false;
  isAddingTransition: boolean = false;
  
  constructor(
    private canvasManager: CanvasManagerService,
    private paramManager: ParameterManagerService
  ) {
    canvasManager.updateBtnState.subscribe(() => {
      this.updateButtonColors();
    });
  }

  ngOnInit(): void {
  }

  /* Action button click functions */
  addGroup() {
    if (this.canvasManager.isAddingGroup) {
      this.canvasManager.setAddingGroup(false);
    } else {
      this.canvasManager.setAddingGroup(true);
    }
  }

  addTransition() {
    if (this.canvasManager.addingTransition != 0) {
      this.canvasManager.setAddingTransition(0);
    } else {
      this.canvasManager.setAddingTransition(1);
    }
  }

  verifyModel() {
    console.log("Verify model");
  }

  saveToFile() {
    console.log("Save to file");

    let file = "interaction.json";
    let text = JSON.stringify(this.canvasManager.interaction);
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8, ' + encodeURIComponent(text));
    element.setAttribute('download', file);
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }

  loadFromFile() {
    console.log("Load from file");
    this.fileUpload.nativeElement.click();
  }

  loadFromUpload(event: any) {
    this.canvasManager.loadInteractionFromJSONFile(event.target.files[0]);
  }

  clear() {
    this.canvasManager.clearCanvas();
    this.paramManager.updateCurrentMicro(undefined);
  }

  saveInteractionToLocal() {
    this.canvasManager.saveInteractionToLocal();
  }

  /* Update view functions */
  updateButtonColors() {
    if (this.canvasManager.isAddingGroup) {
      this.isAddingGroup = true;
      this.isAddingTransition = false;
    } else if (this.canvasManager.addingTransition != 0) {
      this.isAddingGroup = false;
      this.isAddingTransition = true;
    } else {
      this.isAddingGroup = false;
      this.isAddingTransition = false;
    }
  
  }
}
