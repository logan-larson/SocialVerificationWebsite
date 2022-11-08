import { ParameterResult } from '../models/parameterResult';

function getDefaultParams(type: string): ParameterResult[] {
  let results: ParameterResult[] = [];
  
  switch (type) {
    case 'Greeter':
      results.push(new ParameterResult(0, 'bool', false));
      results.push(new ParameterResult(1, 'bool', false));
      break;
    case 'Ask':
      results.push(new ParameterResult(3, 'str', false, -1, ''));
      results.push(new ParameterResult(4, 'array', false, -1, '', new Map<string, string>));
      break;
    case 'Remark':
      results.push(new ParameterResult(5, 'str', false, -1, ''));
      results.push(new ParameterResult(6, 'bool', false));
      results.push(new ParameterResult(7, 'bool', false));
      break;
    case 'Instruction':
      results.push(new ParameterResult(8, 'str', false, -1, ''));
      break;
    case 'Handoff':
      results.push(new ParameterResult(2, 'bool', false));
      break;
    case 'Answer':
      results.push(new ParameterResult(9, 'bool', false));
      break;
    case 'Wait':
      results.push(new ParameterResult(10, 'int', false, 3));
      results.push(new ParameterResult(11, 'bool', false));
      results.push(new ParameterResult(12, 'bool', false));
      break;
  }

  return results;
} 

export default getDefaultParams;
