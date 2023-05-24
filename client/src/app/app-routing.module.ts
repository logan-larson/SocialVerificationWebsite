import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DesignerComponent } from './components/designer/designer.component';

const routes: Routes = [
  { path: 'designer', component: DesignerComponent },
  { path: '', redirectTo: 'designer', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
