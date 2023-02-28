import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
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
  }

  ngAfterViewInit(): void {
    this.drawMinimap();
  }

  drawMinimap(): void {
    const canvas = this.minimap?.nativeElement;
    const context = canvas.getContext('2d');

    if (canvas && context) {
      context.clearRect(0, 0, canvas.width, canvas.height);

      const viewPort = this.getMinimapViewPosition();

      console.log("Drawing");
      context.beginPath();
      context.rect(viewPort.x - 15, viewPort.y - 10, 30, 20);
      context.stroke();
      // context.closePath();
    }
  }

  getMinimapViewPosition(): Position {
    console.log("View position");
    console.log(this.viewPosition);
    console.log("Mini position");
    const pos = new Position((-this.viewPosition.x + 2500) / 25, (-this.viewPosition.y + 1500) / 25);
    console.log(pos);
    return pos;
  }

}
