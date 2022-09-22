import { Component, OnInit, Input } from '@angular/core';
import {Violation} from 'src/app/models/violation';

@Component({
  selector: 'app-violation',
  templateUrl: './violation.component.html',
  styles: [
  ]
})
export class ViolationComponent implements OnInit {

  @Input() violation: Violation = new Violation();

  constructor() { }

  ngOnInit(): void {
  }

}
