import { Component, OnInit } from '@angular/core';
import {Interaction} from 'src/app/models/interaction';
import {MicroInteraction} from 'src/app/models/microInteraction';
import {InteractionManagerService} from 'src/app/services/interaction-manager.service';

@Component({
  selector: 'app-robot-viewer',
  templateUrl: './robot-viewer.component.html',
  styleUrls: []
})
export class RobotViewerComponent implements OnInit {

  interaction: Interaction = new Interaction();

  currentMicro: MicroInteraction | undefined = undefined;
  icon: string = '';

  constructor(
    private interactionManager: InteractionManagerService
  ) { }

  ngOnInit(): void {
    this.interactionManager.getUpdatedInteraction.subscribe((interaction: Interaction) => {
      this.interaction = interaction;
    });

    this.setIcon();
  }

  setIcon() {
    if (this.currentMicro) {
      this.icon = `/assets/robotImages/${this.currentMicro.type}.png`;
    } else {
      this.icon = '/assets/robotImages/neutralRobot.png';
    }
  }

  ready() {
  }

  notReady() {
  }

  playPause() {
  }

  reset() {
  }

}
