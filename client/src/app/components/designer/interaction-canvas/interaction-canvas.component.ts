/*
This component displays the current interaction model on a canvas.
*/

import { Component, ComponentRef, ElementRef, HostListener, OnInit, Renderer2, ViewChild, ViewContainerRef } from '@angular/core';
import { Interaction } from 'src/app/models/interaction';
import { Position } from 'src/app/models/position';
import { Transition } from 'src/app/models/transition';
import { InteractionManagerService } from 'src/app/services/interaction-manager.service';
import { ContextMenuService } from 'src/app/services/context-menu.service';
import { ContextMenuComponent } from './context-menu/context-menu.component';
import { TransitionComponent } from './transition/transition.component';
import {CanvasManagerService} from 'src/app/services/canvas-manager.service';
import { MicroInteraction } from 'src/app/models/microInteraction';
import { MicroComponent } from './micro/micro.component';
import {ParameterManagerService} from 'src/app/services/parameter-manager.service';

@Component({
  selector: 'app-interaction-canvas',
  templateUrl: './interaction-canvas.component.html',
  styles: []
})
export class InteractionCanvasComponent implements OnInit {

  position: Position = new Position();
  scrollPosition: Position = new Position();

  interaction: Interaction = new Interaction();

  contextMenuHidden: boolean = true;

  contextMenuComponent: ContextMenuComponent | null = null;

  @ViewChild("canvas", { read: ViewContainerRef})
  container!: ViewContainerRef; // contents in codepen

  @ViewChild("canvasContainer") canvasContainer!: ElementRef; // grid in codepen

  // Components contained in container
  components: ComponentRef<any>[] = [];

  microComponents: ComponentRef<MicroComponent>[] = [];

  mousePos: Position = new Position();

  /* Zooming and panning */
  containerRect: any;
  panningAllowed: boolean = false;

  spaceHeld: boolean = false;
  zoom: number = 1;

  translate: { scale: number, translateX: number, translateY: number } = { scale: 0, translateX: 0, translateY: 0 };
  initialContentPos: Position = new Position();
  initialZoomPos: Position = new Position();
  pinnedMousePos: Position = new Position();
  //mousePos: Position = new Position();

  // Load JSON stored in local storage
  @HostListener('window:load', ['$event'])
  onLoadHander() {
    this.interactionManager.loadInteractionFromLocal();
  }

  @HostListener("wheel", ['$event'])
  onWheel(event: WheelEvent) {

    if (this.zoom + (event.deltaY / 5000) > 2 || this.zoom + (event.deltaY / 5000) < 0.6) {
      return;
    }

    const oldZoom: number = this.zoom;

    this.zoom -= (event.deltaY / 5000);

    this.mousePos = new Position(event.offsetX - this.containerRect.x, event.offsetY - this.containerRect.y);

    this.translate.scale = this.zoom;

    const contentMousePos: Position = new Position(this.mousePos.x - this.translate.translateX, this.mousePos.y - this.translate.translateY);
    const pos: Position = new Position(this.mousePos.x - (contentMousePos.x * (this.zoom / oldZoom)), this.mousePos.y - (contentMousePos.y * (this.zoom / oldZoom)));

    this.translate.translateX = pos.x;
    this.translate.translateY = pos.y;

    this.updatePanZoom();
    /*
    if (event.deltaY > 0) {
      if (this.zoom > 0.6) {
        this.canvasContainer.nativeElement.style.transform = `scale(${this.zoom -= 0.1})`;
      }
    } else {
      if (this.zoom < 2) {
        this.canvasContainer.nativeElement.style.transform = `scale(${this.zoom += 0.1})`;
      }
    }
    */
  }

  @HostListener('document:keydown.space', ['$event'])
  onSpaceDown(event: KeyboardEvent) {
    event.preventDefault();
    this.spaceHeld = true;
  }

  @HostListener('document:keyup.space', ['$event'])
  onSpaceUp(event: KeyboardEvent) {
    event.preventDefault();
    this.spaceHeld = false;
  }

  // Save JSON to local storage
  @HostListener('window:beforeunload', ['$event'])
  beforeUnloadHander() {
    this.interactionManager.saveInteractionToLocal();
  }

  constructor(
    private interactionManager: InteractionManagerService,
    private parameterManager: ParameterManagerService,
    private canvasManager: CanvasManagerService,
    private contextMenu: ContextMenuService,
    private render: Renderer2,
    private el: ElementRef
  ) {
    setInterval(() => {
      if (this.interactionManager.isAddingTransition && !this.canvasManager.onMicro) {
        this.canvasManager.getMousePosition.emit(this.mousePos);
      }
    }, 20);
  }

  ngOnInit(): void {


    this.render.listen('window', 'load', () => {
      this.position = new Position(this.el.nativeElement.getBoundingClientRect().left, this.el.nativeElement.getBoundingClientRect().top);

      // Set canvas offset in canvasManager OnLoad
      this.canvasManager.canvasOffset = this.position;
      this.canvasManager.canvasScrollOffset = this.scrollPosition;

      this.containerRect = this.canvasContainer.nativeElement.getBoundingClientRect();
    });

    // Listen for microupdates and adjust them as needed
    // TODO I would like to move to this system as it would reduce the rendering required
    // Instead of rerendering the whole interaction on every change, just rerender the change
    this.interactionManager.getUpdatedMicro.subscribe((micro: MicroInteraction) => {
      let currentMicro = this.microComponents.find(m => m.instance.micro.id == micro.id)?.instance;
      if (currentMicro) {
        currentMicro.setMicro(micro);
      }
    });

    this.interactionManager.initTransition.subscribe((t: Transition) => {
      let newTrans = this.container.createComponent(TransitionComponent).instance;
      newTrans.setTransition(t);
    });

    // When interaction changes, re-render the canvas
    this.interactionManager.getUpdatedInteraction.subscribe((interaction) => {
      this.container.clear();
      this.interaction = interaction;
      //console.log(this.interaction);
      this.renderCanvas();
    });

    // Show and hide context menu
    this.contextMenu.showContextMenu.subscribe(() => {
      this.showContextMenu();
    });

    this.render.listen('window', 'resize', () => {
      this.position = new Position(this.el.nativeElement.getBoundingClientRect().left, this.el.nativeElement.getBoundingClientRect().top);

      // Set canvas offset in canvasManager OnResize
      this.canvasManager.canvasOffset = this.position;
    });
  }

  /* CANVAS RENDERING */

  renderCanvas(): void {
    this.interaction.micros.forEach((m: MicroInteraction) => {
      // Create a micro component
      const microComponent = this.container.createComponent(MicroComponent).instance;

      // Set the component to match the model
      microComponent.setMicro(m);
    });

    this.interaction.transitions.forEach((t: Transition) => {
      // Create a transition component
      const transitionComponent = this.container.createComponent(TransitionComponent).instance;

      // Set the component to match the model
      transitionComponent.setTransition(t);
    });

    this.contextMenuComponent = this.container.createComponent(ContextMenuComponent).instance;
  }

  updateScrollOffset(event: any) {
    if (this.spaceHeld) {
      //event.stopPropagation();
      //event.preventDefault();
      console.log("preventing scroll?");
    } else {
      this.scrollPosition.x = event.target.scrollLeft;
      this.scrollPosition.y = event.target.scrollTop;
    }
  }

  startPan(event: any) {
    this.initialContentPos = new Position(this.translate.translateX, this.translate.translateY);
    this.pinnedMousePos = new Position(event.offsetX, event.offsetY);
    this.panningAllowed = true;
  }

  relayCoords(event: any) {
    //this.mousePos = new Position(event.offsetX, event.offsetY);
    this.mousePos = new Position(event.offsetX, event.offsetY);
    if (this.panningAllowed) {
      const diffX = (this.mousePos.x - this.pinnedMousePos.x);
      const diffY = (this.mousePos.y - this.pinnedMousePos.y);
      this.translate.translateX = this.initialContentPos.x + diffX;
      this.translate.translateY = this.initialContentPos.y + diffY;
    }
    this.updatePanZoom();
  }

  endPan(_: any) {
    this.panningAllowed = false;
  }

  updatePanZoom() {
    const matrix = `matrix(${this.translate.scale}, 0, 0, ${this.translate.scale}, ${this.translate.translateX}, ${this.translate.translateY})`;
    this.canvasContainer.nativeElement.style.transform = matrix;
  }
  

  /* CONTEXT MENU */

  showContextMenu(): void {
    this.contextMenuHidden = false;

    if (this.contextMenuComponent) {
      let newPos: Position = new Position(this.contextMenu.position.x + this.scrollPosition.x, this.contextMenu.position.y + this.scrollPosition.y);
      this.contextMenuComponent.setMenu(this.contextMenu.type, newPos, this.contextMenu.microId, this.contextMenu.transitionId);
    } else {
      console.log("context menu comp doesn't exist");
    }
  }

  allowDrop(event: any) {
    event.preventDefault();
  }

  addMicro(event: any) {
    this.interactionManager.addMicro(event.offsetX - 48, event.offsetY - 48);
  }


  clickOff() {
    this.parameterManager.updateCurrentMicro(undefined);
  }

}
