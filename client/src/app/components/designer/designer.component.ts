import { Component, OnInit, } from '@angular/core';

@Component({
  selector: 'app-designer',
  templateUrl: './designer.component.html',
  styleUrls: []
})
export class DesignerComponent implements OnInit {

  showParams: boolean = false;

  constructor() { }

  ngOnInit(): void {
  }
}
