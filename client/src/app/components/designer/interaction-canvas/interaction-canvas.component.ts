/*
This component displays the current interaction model on a canvas.
*/

import {
  Component,
  ComponentRef,
  ElementRef,
  HostListener,
  OnInit,
  Renderer2,
  ViewChild,
  ViewContainerRef,
  ViewRef,
} from '@angular/core';
import { Interaction } from 'src/app/models/interaction';
import { Position } from 'src/app/models/position';
import { Transition } from 'src/app/models/transition';
import { InteractionManagerService } from 'src/app/services/interaction-manager.service';
import { ContextMenuService } from 'src/app/services/context-menu.service';
import { ContextMenuComponent } from './context-menu/context-menu.component';
import { TransitionComponent } from './transition/transition.component';
import { CanvasManagerService } from 'src/app/services/canvas-manager.service';
import { MicroInteraction } from 'src/app/models/microInteraction';
import { MicroComponent } from './micro/micro.component';
import { ParameterManagerService } from 'src/app/services/parameter-manager.service';
import { CdkDragMove, CdkDragStart, CdkDragEnd } from '@angular/cdk/drag-drop';
import { CanvasMinimapService } from 'src/app/services/canvas-minimap.service';

@Component({
  selector: 'app-interaction-canvas',
  templateUrl: './interaction-canvas.component.html',
  styles: [],
})
export class InteractionCanvasComponent implements OnInit {
  position: Position = new Position();
  scrollPosition: Position = new Position();

  interaction: Interaction = new Interaction();

  contextMenuHidden: boolean = true;

  contextMenuComponent: ContextMenuComponent | null = null;

  @ViewChild('canvas', { read: ViewContainerRef })
  container!: ViewContainerRef; // contents in codepen

  // Components contained in container
  components: ComponentRef<any>[] = [];

  microComponents: ComponentRef<MicroComponent>[] = [];

  mousePos: Position = new Position();

  tutorialImage: string = 'assets/tutorialDark.png';
  tutorialHidden: boolean = false;

  selectTooltip: string = 'hidden';
  dragTooltip: string = 'hidden';

  // Load JSON stored in local storage
  @HostListener('window:load', ['$event'])
  onLoadHander() {
    this.interactionManager.loadInteractionFromLocal();

    // Set the scroll position from local storage
    let scrollPositionStr = localStorage.getItem('scrollPosition');

    this.tutorialHidden = localStorage.getItem('tutorialHidden') === 'true';

    this.canvasManager.setTutorialHidden(this.tutorialHidden);

    if (scrollPositionStr) {
      let scrollPosition = JSON.parse(scrollPositionStr);

      let canvas = document.getElementById('canvas');
      if (canvas) {
        console.log(scrollPosition);
        this.scrollPosition = new Position(scrollPosition.x, scrollPosition.y);
        canvas.style.transform = `translate(-50%, -50%) translate3d(${this.scrollPosition.x}px, ${this.scrollPosition.y}px, 0px)`;
        this.canvasMinimap.setViewPosition(this.scrollPosition);
      }
    }

    this.position = new Position(
      this.el.nativeElement.getBoundingClientRect().left,
      this.el.nativeElement.getBoundingClientRect().top
    );

    // Set canvas offset in canvasManager OnLoad
    this.canvasManager.canvasOffset = this.position;
    this.canvasManager.canvasScrollOffset = this.scrollPosition;
  }

  // Save JSON to local storage
  @HostListener('window:beforeunload', ['$event'])
  beforeUnloadHander() {
    this.interactionManager.saveInteractionToLocal();
    localStorage.setItem('scrollPosition', JSON.stringify(this.scrollPosition));
  }

  /* Canvas Operations */

  mode: string = 'select';
  isDarkMode: boolean = false;
  zoomLevel: number = 1;
  zoomFactor: number = 1.01;
  lastMouseX: number = 0;
  lastMouseY: number = 0;
  lastElemX: number = 0;
  lastElemY: number = 0;

  /*
  @HostListener('wheel', ['$event'])
  zoom(event: WheelEvent) {
    //event.deltaY < 0 ? this.zoomIn() : this.zoomOut();

    const delta = Math.sign(-event.deltaY);
    this.zoomLevel *= (Math.pow(this.zoomFactor, delta));

    const canvas = document.getElementById("canvas");
    if (canvas) {

      const newElemX = (event.offsetX - this.lastMouseX) * (this.zoomFactor - 1) + this.lastElemX;
      const newElemY = (event.offsetY - this.lastMouseY) * (this.zoomFactor - 1) + this.lastElemY;

      canvas.style.transform = `translate(${newElemX}px, ${newElemY}px) scale(${this.zoomLevel})`;

      this.lastMouseX = event.offsetX;
      this.lastMouseY = event.offsetY;
      this.lastElemX = newElemX;
      this.lastElemY = newElemY;
    }
  }
  */

  isPanning: boolean = false;
  canvasX: number = 0;
  canvasY: number = 0;

  //@HostListener('mousedown', ['$event'])
  onDragStart(event: CdkDragStart) {
    if (this.canvasManager.mode == 'pan') {
      this.isPanning = true;
    }
  }

  //@HostListener('mousemove', ['$event'])
  onDragMove(event: CdkDragMove) { }

  //@HostListener('mouseup', ['$event'])
  onDragEnd(event: CdkDragEnd) {
    if (this.canvasManager.mode == 'pan') {
      this.isPanning = false;

      const canvas = document.getElementById('canvas');

      if (canvas) {
        this.scrollPosition.addPosition(
          new Position(event.distance.x, event.distance.y)
        );
        this.canvasManager.canvasScrollOffset = this.scrollPosition;
        this.canvasMinimap.setViewPosition(this.scrollPosition);
      }
    }
  }

  constructor(
    private interactionManager: InteractionManagerService,
    private parameterManager: ParameterManagerService,
    private canvasManager: CanvasManagerService,
    private canvasMinimap: CanvasMinimapService,
    private contextMenu: ContextMenuService,
    private render: Renderer2,
    private el: ElementRef
  ) {
    setInterval(() => {
      if (this.interactionManager.isAddingTransition) {
        if (
          this.canvasManager.onMicroPos.x == 0 &&
          this.canvasManager.onMicroPos.y == 0
        ) {
          this.canvasManager.getMousePosition.emit(this.mousePos);
        }
      }
    }, 20);
  }

  ngOnInit(): void {
    this.render.listen('window', 'load', () => { });

    // Listen for microupdates and adjust them as needed
    // TODO I would like to move to this system as it would reduce the rendering required
    // Instead of rerendering the whole interaction on every change, just rerender the change
    this.interactionManager.getUpdatedMicro.subscribe(
      (micro: MicroInteraction) => {
        let currentMicro = this.microComponents.find(
          (m) => m.instance.micro.id == micro.id
        )?.instance;
        if (currentMicro) {
          currentMicro.setMicro(micro);
        }
      }
    );

    this.interactionManager.initTransition.subscribe((t: Transition) => {
      let newTrans =
        this.container.createComponent(TransitionComponent).instance;
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
      this.position = new Position(
        this.el.nativeElement.getBoundingClientRect().left,
        this.el.nativeElement.getBoundingClientRect().top
      );

      // Set canvas offset in canvasManager OnResize
      this.canvasManager.canvasOffset = this.position;
    });

    this.canvasManager.getModeEmitter.subscribe(
      (_) => (this.mode = this.canvasManager.mode)
    );

    this.canvasManager.clearCanvas.subscribe((_) => {
      this.scrollPosition = new Position(0, 0);
      this.canvasManager.canvasScrollOffset = this.scrollPosition;
      this.canvasMinimap.setViewPosition(this.scrollPosition);
    });

    this.tutorialImage = this.canvasManager.isDarkMode
      ? 'assets/tutorialDark.png'
      : 'assets/tutorialLight.png';

    this.canvasManager.getIsDarkMode.subscribe((d) => {
      this.isDarkMode = d;
      this.tutorialImage = this.isDarkMode
        ? 'assets/tutorialDark.png'
        : 'assets/tutorialLight.png';
    });

    this.canvasManager.getTutorialHiddenEmitter.subscribe((t) => {
      this.tutorialHidden = t;
    });
  }

  /* CANVAS RENDERING */

  renderCanvas(): void {
    this.interaction.micros.forEach((m: MicroInteraction) => {
      // Create a micro component
      const microComponent =
        this.container.createComponent(MicroComponent).instance;

      // Set the component to match the model
      microComponent.setMicro(m);
    });

    this.interaction.transitions.forEach((t: Transition) => {
      // Create a transition component
      const transitionComponent =
        this.container.createComponent(TransitionComponent).instance;

      // Set the component to match the model
      transitionComponent.setTransition(t);
    });

    this.contextMenuComponent =
      this.container.createComponent(ContextMenuComponent).instance;
  }

  setMousePos(event: any): void {
    //this.mousePos = new Position(event.clientX, event.clientY);
    this.mousePos = new Position(event.offsetX, event.offsetY);
  }

  /* CONTEXT MENU */

  showContextMenu(): void {
    this.contextMenuHidden = false;

    if (this.contextMenuComponent) {
      let newPos: Position = new Position(
        this.contextMenu.position.x,
        this.contextMenu.position.y
      );
      this.contextMenuComponent.setMenu(
        this.contextMenu.type,
        newPos,
        this.contextMenu.microId,
        this.contextMenu.transitionId
      );
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

  /* CANVAS OPERATIONS */

  selectMain() {
    this.canvasManager.setCanvasMode('select');
  }

  selectPan() {
    this.canvasManager.setCanvasMode('pan');
  }

  zoomIn() {
    if (this.zoomLevel < 3) this.zoomLevel += 0.01;

    const container = document.getElementById('canvas');
    if (container != null) {
      let scale: string = `scale(${this.zoomLevel})`;
      let translate: string = `translate(${this.zoomLevel})`;
      container.style.transform = `${scale} ${translate}`;
      this.canvasManager.setZoomLevel(this.zoomLevel);
    }
  }

  zoomOut() {
    if (this.zoomLevel > 0.5) this.zoomLevel -= 0.01;

    const container = document.getElementById('canvas');
    if (container != null) {
      container.style.transform = `scale(${this.zoomLevel})`;
      this.canvasManager.setZoomLevel(this.zoomLevel);
    }
  }
}
