import { Component, OnInit } from '@angular/core';
import {CanvasManagerService} from './services/canvas-manager.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: []
})
export class AppComponent {
  title = 'client';

  isDarkMode: boolean = false;

  constructor(private canvasManager: CanvasManagerService) {
  }

  ngOnInit(): void {
    this.canvasManager.getIsDarkMode.subscribe(isDarkMode => this.isDarkMode = isDarkMode);

    let d: string | null = localStorage.getItem('isDarkMode');

    if (d != null) {
      this.canvasManager.setTheme(d === 'true');
    } else {
      this.isDarkMode = this.canvasManager.isDarkMode;
    }

  }
}
