import { Parameter } from './parameter';

export class MicroType {
  parameters: Parameter[] | [];
  type: string;
  description: string;

  constructor(
    type: string = 'Greeter',
    parameters: Parameter[] | [] = [],
    description: string = ''
  ) {
    this.type = type;
    this.parameters = parameters;
    this.description = description;
  }
}
