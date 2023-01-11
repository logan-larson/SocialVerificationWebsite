import { Parameter } from "./parameter";
import { ParameterResult } from "./parameterResult";
import {Position} from "./position";

export class MicroInteraction {

    id: number;
    position: Position;
    type: string | null; // i.e. 'Greeter', 'Farewell'
    robotText: string | null;
    parameters: Parameter[] = [];
    parameterResults: ParameterResult[] = [];  
    readyTransitionId: number;
    notReadyTransitionId: number;

    constructor(
      id: number = -1,
      position: Position = new Position(),
      type: string = '',
      robotText: string = '',
      parameters: Parameter[] = [],
      // these are rarely ever included in instantiation
      parameterResults: ParameterResult[] = [],
      readyTransitionId: number = -1,
      notReadyTransitionId: number = -1,
    ) { //micros are built off a microType defined
        this.id = id;
        this.position = position;
        this.type = type;
        this.robotText = robotText;
        this.parameters = parameters;

        this.readyTransitionId = readyTransitionId;
        this.notReadyTransitionId = notReadyTransitionId;
        /*
        if (parameterResults == []) {
          this.parameters.forEach(parameter => {
            if (parameter.type == "bool") {
              this.parameterResults.push(new ParameterResult(parameter.id, 'bool'));
            } else if (parameter.type == "str") {
              this.parameterResults.push(new ParameterResult(parameter.id, 'str'));
            } else if (parameter.type == "int") {
              this.parameterResults.push(new ParameterResult(parameter.id, 'int'));
            } else if (parameter.type == "array") {
              this.parameterResults.push(new ParameterResult(parameter.id, 'array'));
            }
          });
        } else {
        */
          this.parameterResults = parameterResults;
        //}
    }

    updateResults(results: ParameterResult[]) {
        this.parameterResults = results;
    }
}
