/*
This component is generated by the interaction options component. It represents a
single parameter in the parent microinteraction. It communicates with the interaction
options component for updating the parameter results when the user changes them. It is
also a general component that can represent all of the different types of parameters.
*/

import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Parameter } from 'src/app/models/parameter';
import { ParameterResult } from 'src/app/models/parameterResult';

@Component({
  selector: 'app-parameter-options',
  templateUrl: './parameter-options.component.html',
  styles: [
  ]
})
export class ParameterOptionsComponent implements OnInit {

  @Input() microType: string | null = '';
  @Input() param: Parameter = new Parameter();
  @Input() name: string = '';
  @Input() index: number = -1;
  @Input() result: ParameterResult = new ParameterResult();

  paramRes: ParameterResult | null = null;
  @Output() resultEmitter = new EventEmitter<ParameterResult>();

  showToolTip: string = 'hidden';

  // array type
  responses: { type: string, value: string }[] = [];
  //responses: Map<string, string> = new Map();

  humanState: string = '';
  response: string = '';

  // int type
  intVal: number | null = null;

  // str type
  strVal: string | null = null

  // bool type
  boolVal: boolean | null = null;

  constructor() { }

  ngOnInit(): void {
    if (this.result) {
      this.paramRes = this.result;
    }

    this.setView();
  }

  setView() {
    if (this.paramRes) {
      if (this.paramRes.type == 'bool') {
        this.boolVal = this.paramRes.boolResult;
      } else if (this.paramRes.type == 'int') {
        this.intVal = this.paramRes.intResult;
      } else if (this.paramRes.type == 'str') {
        this.strVal = this.paramRes.strResult;
      } else if (this.paramRes.type == 'array') {
        if (this.paramRes.arrayResult) {
          this.responses = this.paramRes.arrayResult;
        }
      }
    }
  }

  addResponse() {

    if (this.humanState == '' || this.response == '') {
      alert('Please fill out both response and human state fields');
      return;
    }

    this.responses.push({ type: this.humanState, value: this.response });

    this.humanState = '';
    this.response = '';

    this.paramRes = new ParameterResult(this.index, 'array', null, null, null, this.responses);
    this.resultEmitter.emit(this.paramRes);
  }

  removeResponse(value: string) {
    this.responses = this.responses.filter(r => r.value != value);
    //this.responses.delete(key);

    this.paramRes = new ParameterResult(this.index, 'array', null, null, null, this.responses);
    this.resultEmitter.emit(this.paramRes);
  }

  changeBoolVal(v: boolean) {
    this.boolVal = v;
    this.paramRes = new ParameterResult(this.index, 'bool', v, null, null, null);
    this.resultEmitter.emit(this.paramRes);
  }

  changeStrVal(event: any) {
    this.strVal = event.target.value;
    this.paramRes = new ParameterResult(this.index, 'str', null, null, event.target.value, null);
    this.resultEmitter.emit(this.paramRes);
  }

  changeIntVal(event: any) {
    this.intVal = event.target.value;
    this.paramRes = new ParameterResult(this.index, 'int', null, event.target.value, null, null);
    this.resultEmitter.emit(this.paramRes);
  }
}
