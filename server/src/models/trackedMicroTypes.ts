import { MicroType } from './microType';
import { Parameter } from './parameter';

let microTypes: MicroType[] = [];

//greeter
let microGreeter = new MicroType(
  'Greeter',
  [
    new Parameter(
      'Wait for Response',
      'Wait_for_response',
      'Set whether the robot waits for the human to greet back',
      'bool'
    ),
    new Parameter(
      'Greet with Handshake',
      'Greet_with_handshake',
      'Set whether the robot extends its arm for a handshake',
      'bool'
    ),
  ],
  'Greeter is always the first micro in the interaction. An interaction is only allowed one Greeter micro. The robot will greet the human with a greeting salutation of the designer’s choosing.'
);
microTypes.push(microGreeter);

//ask
let microAsk = new MicroType(
  'Ask',
  [
    new Parameter(
      'Question',
      'question',
      'The Specific question the robot will ask',
      'str'
    ),
    new Parameter(
      'Recognized Responses',
      'reponses',
      'The responses expeceted to be said by the human that the robot can recognize',
      'array'
    ),
    /*
  new Parameter("Ready Reponse", "responseReady", "The expeceted response of a human in the Ready state", "str"),
  new Parameter("Not Ready Response", "responseNotReady", "The expected response of a human in the Not Ready state", "str")
  */
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
      'What the robot will say to the user',
      'str'
    ),
    new Parameter(
      'Use Gesture',
      'use_gesture',
      'Should the robot use gestures (this is different from handoff)',
      'bool'
    ),
    new Parameter(
      'Allow the human to respond',
      'Allow_human_to_respond',
      "Whether the robot gives the human any time to respond after the robot's remark before moving on",
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
      'Instruction',
      'Instruction',
      'The instruction that the robot will provide the human',
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
      'Robot Speaks',
      'robot_speaks',
      'Robot speaks during handoff',
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
      'Introduction',
      'Robot begins microinteraction by saying I can answer your question',
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
      'wait time (seconds)',
      'Number of seconds for the robot to wait',
      'int'
    ),
    new Parameter(
      'Allow Speech',
      'allow_speech',
      'Allows a human to say something to the robot to override its wait time',
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
