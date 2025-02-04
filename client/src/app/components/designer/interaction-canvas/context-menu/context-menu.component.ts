/*
This component is generated when the user right-clicks
on another component. It displays actions that are possible
to apply to the component that was clicked on.
*/

import { Component, OnInit, Input, ElementRef, HostListener } from '@angular/core';
import { Position } from 'src/app/models/position';
import { InteractionManagerService } from 'src/app/services/interaction-manager.service';
import { ContextMenuService } from 'src/app/services/context-menu.service';
import {ParameterManagerService} from 'src/app/services/parameter-manager.service';

@Component({
  selector: 'app-context-menu',
  templateUrl: './context-menu.component.html',
  styles: [
  ]
})
export class ContextMenuComponent implements OnInit {

  @Input() type: string = 'group';
  @Input() microId: number = -1;
  @Input() transitionId: number = -1;

  @Input() position: Position = new Position();

  x: string = '';
  y: string = '';

  menuHidden: boolean = true;

  removeGroupHidden: boolean = true;
  removeTransitionHidden: boolean = true;
  removeMicroHidden: boolean = true;

  // Hide the context menu when the user clicks off of it
  @HostListener('document:click', ['$event'])
  clickOff(event: any) {
    if(!this.el.nativeElement.contains(event.target)) {
      this.menuHidden = true;
      this.contextMenu.type = '';
      this.contextMenu.hideContextMenu.emit();
    }
  }

  constructor(
    private interactionManager: InteractionManagerService,
    private parameterManager: ParameterManagerService,
    private contextMenu: ContextMenuService,
    private el: ElementRef
  ) { }

  ngOnInit(): void {
    this.contextMenu.hideContextMenu.subscribe((_) => {
      this.menuHidden = true;
      this.contextMenu.type = '';
    });
  }

  // Set the context menu to be visible and set its position
  setMenu(type: string, position: Position, microId: number = -1, transitionId: number = -1): void {
    this.menuHidden = false;

    this.type = type;
    this.position = position;

    this.microId = microId;
    this.transitionId = transitionId;

    this.x = position.x + 'px';
    this.y = position.y + 'px';
  }

  /* Actions the context menu can perform */

  resetMidpoint() {
    this.interactionManager.resetMidpoint.emit(this.transitionId);
  }

  removeTransition() {
    this.interactionManager.removeTransition(this.transitionId);
  }

  removeMicro() {
    this.interactionManager.removeMicro(this.microId);
    if (this.parameterManager.micro && this.parameterManager.micro.id === this.microId) {
      this.parameterManager.updateCurrentMicro(undefined);
    }
  }

}
