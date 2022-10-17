import { Parameter } from "./parameter";
import { ParameterResult } from "./parameterResult";
import {Position} from "./position";
import {Transition} from "./transition";

export class MicroInteraction {

    id: number;
    x: number;
    y: number;
    type: string | null; // i.e. 'Greeter', 'Farewell'
    parameters: Parameter[] = [];
    parameterResults: ParameterResult[] = [];  
    readyTransition: Transition | null = null;
    notReadyTransition: Transition | null = null;
    //Note: results are stored as follows: {parameter id: resultString} (or list instead of result string case of type=array) so parameterResults looks like [{0,"yes"},{20,"option1"}] --these will be passed to backend along with the variable name(which is stored in parameter)

    constructor(
      id: number = -1,
        x: number = 0,
        y: number = 0,
        type: string = '',
        parameters: Parameter[] = [],
        parameterResults: ParameterResult[] = [],
        readyTransition: Transition | null = null,
        notReadyTransition: Transition | null = null,
    ) { 
        this.id = id;
        this.x = x;
        this.y = y;
        this.type = type;
        this.parameters = parameters;
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
          this.parameterResults = parameterResults;
        }

        this.readyTransition = readyTransition;
        this.notReadyTransition = notReadyTransition;
    }

    updateResults(results: ParameterResult[]) {
        this.parameterResults = results;
    }

    getReadyAnchor(): Position {
      return new Position(this.x, this.y);
    }

    getNotReadyAnchor(): Position {
      return new Position(this.x, this.y);
    }
    getInputAnchor(): Position {
      return new Position(this.x, this.y);
    }
}
