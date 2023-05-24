/*
This component houses the whole application.
Initially I thought there would be more components besides the designer, such as authentication, but I didn't get around to it.
*/

import { Component, OnInit, } from '@angular/core';

@Component({
  selector: 'app-designer',
  templateUrl: './designer.component.html',
})
export class DesignerComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }
}
