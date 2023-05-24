import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MatIconModule } from '@angular/material/icon';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DesignerComponent } from './components/designer/designer.component';
import { ActionsBarComponent } from './components/designer/actions-bar/actions-bar.component';
import { MicrointeractionSelectorComponent } from './components/designer/microinteraction-selector/microinteraction-selector.component';
import { InteractionCanvasComponent } from './components/designer/interaction-canvas/interaction-canvas.component';
import { InteractionOptionsComponent } from './components/designer/right-panel/interaction-options/interaction-options.component';
import { ViolationOutputComponent } from './components/designer/violation-output/violation-output.component';
import { RobotViewerComponent } from './components/designer/right-panel/robot-viewer/robot-viewer.component';
import { TransitionComponent } from './components/designer/interaction-canvas/transition/transition.component';
import { ContextMenuComponent } from './components/designer/interaction-canvas/context-menu/context-menu.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MicroComponent } from './components/designer/interaction-canvas/micro/micro.component';
import { ParameterOptionsComponent } from './components/designer/right-panel/interaction-options/parameter-options/parameter-options.component';
import { ViolationComponent } from './components/designer/violation-output/violation/violation.component';
import { RightPanelComponent } from './components/designer/right-panel/right-panel.component';
import { CanvasMinimapComponent } from './components/designer/interaction-canvas/canvas-minimap/canvas-minimap.component';
import { TutorialControllerComponent } from './components/designer/interaction-canvas/tutorial-controller/tutorial-controller.component';

@NgModule({
  declarations: [
    AppComponent,
    DesignerComponent,
    ActionsBarComponent,
    MicrointeractionSelectorComponent,
    InteractionCanvasComponent,
    InteractionOptionsComponent,
    ViolationOutputComponent,
    RobotViewerComponent,
    TransitionComponent,
    ContextMenuComponent,
    MicroComponent,
    ParameterOptionsComponent,
    ViolationComponent,
    RightPanelComponent,
    CanvasMinimapComponent,
    TutorialControllerComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    DragDropModule,
    NoopAnimationsModule,
    FormsModule,
    HttpClientModule,
    MatIconModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
