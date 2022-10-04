import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TitleBarComponent } from './components/title-bar/title-bar.component';
import { DesignerComponent } from './components/designer/designer.component';
import { AuthComponent } from './components/auth/auth.component';
import { ActionsBarComponent } from './components/designer/actions-bar/actions-bar.component';
import { MicrointeractionSelectorComponent } from './components/designer/microinteraction-selector/microinteraction-selector.component';
import { InteractionCanvasComponent } from './components/designer/interaction-canvas/interaction-canvas.component';
import { InteractionOptionsComponent } from './components/designer/interaction-options/interaction-options.component';
import { ViolationOutputComponent } from './components/designer/violation-output/violation-output.component';
import { RobotViewerComponent } from './components/designer/robot-viewer/robot-viewer.component';
import { TransitionComponent } from './components/designer/interaction-canvas/transition/transition.component';
import { ContextMenuComponent } from './components/designer/interaction-canvas/context-menu/context-menu.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MicroComponent } from './components/designer/interaction-canvas/micro/micro.component';
import { ParameterOptionsComponent } from './components/designer/interaction-options/parameter-options/parameter-options.component';
import { ViolationComponent } from './components/designer/violation-output/violation/violation.component';

@NgModule({
  declarations: [
    AppComponent,
    TitleBarComponent,
    DesignerComponent,
    AuthComponent,
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
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    DragDropModule,
    NoopAnimationsModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
