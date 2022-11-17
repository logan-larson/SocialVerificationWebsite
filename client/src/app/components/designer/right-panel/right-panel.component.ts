import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-right-panel',
  templateUrl: './right-panel.component.html',
  styles: [
  ]
})
export class RightPanelComponent implements OnInit {

  showSim: boolean = false;

  constructor() { }

  ngOnInit(): void {
  }

  showParams() {
    setTimeout(() => this.showSim = false, 0);
  }
}
