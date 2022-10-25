import { Parameter } from "./parameter";
import { ParameterResult } from "./parameterResult";
import {Position} from "./position";

export class MicroInteraction {

    id: number;
    position: Position;
    anchorPosition: Position;
    type: string | null; // i.e. 'Greeter', 'Farewell'
    parameters: Parameter[] = [];
    parameterResults: ParameterResult[] = [];
    readyTransitionId: number = -1;
    notReadyTransitionId: number = -1;
    //Note: results are stored as follows: {parameter id: resultString} (or list instead of result string case of type=array) so parameterResults looks like [{0,"yes"},{20,"option1"}] --these will be passed to backend along with the variable name(which is stored in parameter)

    constructor(
      id: number = -1,
      position: Position = new Position(),
      type: string = '',
      parameters: Parameter[] = [],
      anchorPosition: Position = new Position(),
      // these are rarely ever included in instantiation
      parameterResults: ParameterResult[] = [],
      readyTransitionId: number = -1,
      notReadyTransitionId: number = -1,
    ) {
        this.id = id;
        this.position = position;
        this.type = type;
        this.parameters = parameters;
        this.anchorPosition = anchorPosition;
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

        this.readyTransitionId = readyTransitionId;
        this.notReadyTransitionId = notReadyTransitionId;
    }

    updateResults(results: ParameterResult[]) {
        this.parameterResults = results;
    }

    getReadyAnchor(): Position {
      return this.position;
    }

    getNotReadyAnchor(): Position {
      return this.position;
    }
    getInputAnchor(): Position {
      return this.position;
    }
}
