import { MicroType } from './microType';
import { Parameter } from './parameter';

let microTypes: MicroType[] = [];

//greeter
let microGreeter = new MicroType(
  'Greeter',
  [
    new Parameter(
      'Wait for human response',
      'wait_for_response',
      'If true, the robot will wait for the human to respond to its greeting. If false, the robot will go to the next micro based on the human’s state.',
      'bool'
    ),
    new Parameter(
      'Greet with Handshake',
      'greet_with_handshake',
      'If true, the robot will wave and then extend their hand for a handshake. If false, the robot will just wave.',
      'bool'
    ),
  ],
  `Greeter is always the first micro in the interaction. An interaction is only allowed one Greeter micro. The robot will greet the human with a greeting salutation of the designer’s choosing.`
);
microTypes.push(microGreeter);

//ask
let microAsk = new MicroType(
  'Ask',
  [
    new Parameter(
      'Question',
      'question',
      'The question the robot will ask',
      'str'
    ),
    new Parameter(
      'Recognized Responses',
      'reponses',
      'The responses expeceted to be said by the human that the robot can recognize',
      'array'
    ),
  ],
  'Ask provides a way for the robot to ask the human a question and evaluate the human’s state according to the human’s response.'
);
microTypes.push(microAsk);

//remark
let microRemark = new MicroType(
  'Remark',
  [
    new Parameter(
      'Content',
      'content',
      'The comment the robot will say to the human',
      'str'
    ),
    new Parameter(
      'Use gesture',
      'use_gesture',
      'If true, the robot will make a gesture while saying its remark. If false, the robot will just say its remark.',
      'bool'
    ),
    new Parameter(
      'Wait for human response',
      'allow_human_to_respond',
      "If true, the robot will wait for the human to respond to its remark. If false, the robot will go to the next micro based on the human's state.",
      'bool'
    ),
  ],
  'Remark provides a way for the robot to make a comment during the interaction.'
);
microTypes.push(microRemark);

//instruction
let microInstruct = new MicroType(
  'Instruction',
  [
    new Parameter(
      'Content',
      'content',
      'The instruction the robot will provide the human',
      'str'
    ),
  ],
  'Instruction is used to tell the human the robot expects something of them. An example could be the robot asking the human to sign for a package.'
);
microTypes.push(microInstruct);

//handoff
let microHandoff = new MicroType(
  'Handoff',
  [
    new Parameter(
      'Robot speaks',
      'robot_speaks',
      'If true, the robot begins microinteraction by saying "I have something to give you". If false, the robot just hands off the object.',
      'bool'
    ),
  ],
  'Handoff is used when the robot has something to give to the human.'
);
microTypes.push(microHandoff);

//answer
let microAnswer = new MicroType(
  'Answer',
  [
    new Parameter(
      'Introduction',
      'introduction',
      'If true, the robot begins microinteraction by saying "I can answer your question". If false, the robot just answers question.',
      'bool'
    ),
  ],
  'Answer provides a way for the robot to answer any questions the human might have.'
);
microTypes.push(microAnswer);

//wait
let microWait = new MicroType(
  'Wait',
  [
    new Parameter(
      'Wait Time (seconds)',
      'wait_time',
      'The number of seconds the robot will wait before proceeding to the next microinteraction',
      'int'
    ),
    new Parameter(
      'Allow speech',
      'allow_speech',
      'If true the robot will allow the human to say something to override the wait time. If false, the robot will wait for the specified amount of time before proceeding to the next microinteraction.',
      'bool'
    ),
    new Parameter(
      'Look At People',
      'look_at_people',
      'Enable face tracking, which allows the robot to met the gaze of anyone in its vicinity',
      'bool'
    ),
  ],
  'Wait provides a way for the robot to wait for a certain amount of time or until the human says something.'
);
microTypes.push(microWait);

//farwell
let microFarewell = new MicroType(
  'Farewell',
  [],
  'Farewell is always the last micro in the interaction. The robot will say goodbye to the human before ending the interaction.'
);
//  with a goodbye salutation of the designer’s choosing.
microTypes.push(microFarewell);

export function getMicroType(type: string): MicroType | undefined {
  let mt: MicroType | undefined = microTypes.find((m) => m.type == type);

  return mt;
}
