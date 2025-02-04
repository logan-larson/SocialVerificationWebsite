/*
Manages the minimap. The minimap is a small version of the canvas that shows the entire canvas, the micros, and the current view port.
*/

import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Interaction } from 'src/app/models/interaction';
import { MicroInteraction } from 'src/app/models/microInteraction';
import { Position } from 'src/app/models/position';
import { CanvasManagerService } from 'src/app/services/canvas-manager.service';
import { CanvasMinimapService } from 'src/app/services/canvas-minimap.service';
import { InteractionManagerService } from 'src/app/services/interaction-manager.service';

@Component({
  selector: 'app-canvas-minimap',
  templateUrl: './canvas-minimap.component.html',
  styles: [
  ]
})
export class CanvasMinimapComponent implements OnInit, AfterViewInit {

  @ViewChild('minimap') minimap: ElementRef | undefined;

  viewPosition: Position = new Position(0, 0);
  interaction: Interaction = new Interaction();

  constructor(
    private canvasMinimap: CanvasMinimapService,
    private canvasManager: CanvasManagerService,
    private interactionManager: InteractionManagerService
  ) { }

  ngOnInit(): void {
    this.canvasMinimap.viewPositionChange.subscribe((viewPosition: Position) => {
      this.viewPosition = viewPosition;
      this.drawMinimap();
    });

    this.interactionManager.getUpdatedInteraction.subscribe((interaction: Interaction) => {
      this.interaction = interaction;
      this.drawMinimap();
    });

    this.canvasMinimap.redrawMinimap.subscribe(() => {
      this.drawMinimap();
    });
  }

  ngAfterViewInit(): void {
    this.drawMinimap();
  }

  // Draw the minimap
  // Called when the view position changes or the interaction is updated
  drawMinimap(): void {
    const canvas = this.minimap?.nativeElement;
    const context = canvas.getContext('2d');

    if (canvas && context) {
      context.clearRect(0, 0, canvas.width, canvas.height);

      const viewPort = this.toViewMinimapPosition(this.viewPosition);
      const viewPortWidth = this.canvasManager.canvasWidth / 25;
      const viewPortHeight = this.canvasManager.canvasHeight / 25;

      // Draw the view port rectangle
      context.beginPath();
      context.rect(viewPort.x, viewPort.y, viewPortWidth, viewPortHeight);
      context.stroke();
      context.closePath();

      // Draw the micros
      this.interaction.micros.forEach((micro: MicroInteraction) => {
        const pos = this.toMicroMinimapPosition(micro.position);
        context.fillStyle = this.getMicroColor(micro);
        context.beginPath();
        context.fillRect(pos.x - 3, pos.y - 4, 6, 8);
        context.stroke();
        context.closePath();
      });
    }
  }

  // Convert the view position to the minimap position
  toViewMinimapPosition(position: Position): Position {
    return new Position((-position.x + 2500) / 25, (-position.y + 1500) / 25);
  }

  // Convert the micro position to the minimap position
  toMicroMinimapPosition(position: Position): Position {
    return new Position(position.x / 25, position.y / 25);
  }

  getMicroColor(micro: MicroInteraction): string {
    switch (micro.type) {
      case 'Greeter':
        return 'rgb(34 197 94)';
      case 'Ask':
        return 'rgb(96 165 250)';
      case 'Remark':
        return 'rgb(45 212 191)';
      case 'Instruction':
        return 'rgb(252 211 77)';
      case 'Handoff':
        if (this.canvasManager.isDarkMode)
          return 'rgb(255 255 255)';
        else
          return 'rgb(100 116 139)';
      case 'Answer':
        return 'rgb(168 85 247)';
      case 'Wait':
        return 'rgb(251 146 60)';
      case 'Farewell':
        return 'rgb(244 114 182)';
      default:
        return 'rgb(0 0 0)';
    }
  }

}
