import express from 'express';
import { MicroType } from '../models/microType';
import { getMicroType } from '../models/trackedMicroTypes';
import { MicroAnimation } from '../models/microAnimation';


const router = express.Router();

router.get('/:type', (req, res) => {

  console.log('req.query: ' + JSON.stringify(req.query));

  try {
    let mt: MicroType | undefined = getMicroType(req.params.type);

    if (mt) {
      let animation: MicroAnimation[] = [];

      switch (mt.type) {
        case 'Greeter':
          animation = getAnimationGreeter(req.query);
          break;
        case 'Ask':
          animation = getAnimationAsk(req.query);
          break;
        case 'Remark':
          animation = getAnimationRemark(req.query);
          break;
        case 'Instruction':
          animation = getAnimationInstruction(req.query);
          break;
        case 'Handoff':
          animation = getAnimationHandoff(req.query);
          break;
        case 'Answer':
          animation = getAnimationAnswer(req.query);
          break;
        case 'Wait':
          animation = getAnimationWait(req.query);
          break;
        case 'Farewell':
          animation = getAnimationFarewell(req.query);
          break;
        default:
          animation = getAnimationIdle();
          break;
      }

      res.json(animation);
    } else {
      res.status(404).send(`Animations for microtype of ${req.params.type} not found`);
    }
  } catch (e) {
    res.status(500).send(e);
  }
});

function getAnimationGreeter(queryParams: any): MicroAnimation[] {
  // Handshake param - arm extended or not

  let animation: MicroAnimation[] = [];
  let index = 0;

  animation.push({
    name: 'Greeter',
    index: index++,
    imageLocation: 'assets/armRaise.png'
  });

  if (queryParams != undefined && queryParams['handshake'] == 'true') {
    animation.push({
      name: 'Greeter',
      index: index++,
      imageLocation: 'assets/handoff.png'
    });
  }

  return animation;
}

function getAnimationAsk(queryParams: any): MicroAnimation[] {
  // No params
  // During ask - head tilt right
  // Misunderstand - arms raised in confusion

  let animation: MicroAnimation[] = [];
  let index = 0;

  animation.push({
    name: 'Ask',
    index: index++,
    imageLocation: 'assets/headTiltRight.png'
  });

  return animation;
}

function getAnimationRemark(queryParams: any): MicroAnimation[] {
  // Gesture param - arm raised with 'ah-ha' expression

  let animation: MicroAnimation[] = [];
  let index = 0;

  animation.push({
    name: 'Remark',
    index: index++,
    imageLocation: 'assets/neutral.png'
  });

  if (queryParams != undefined && queryParams['gesture'] == 'true') {
    animation.push({
      name: 'Remark',
      index: index++,
      imageLocation: 'assets/armRaise.png'
    });
  }


  return animation;
}

function getAnimationInstruction(queryParams: any): MicroAnimation[] {
  // No params
  // During instruction - neutral expression

  let animation: MicroAnimation[] = [];
  let index = 0;

  animation.push({
    name: 'Instruction',
    index: index++,
    imageLocation: 'assets/neutral.png'
  });

  return animation;
}

function getAnimationHandoff(queryParams: any): MicroAnimation[] {
  // No params
  // During handoff - both arms extended

  let animation: MicroAnimation[] = [];
  let index = 0;

  animation.push({
    name: 'Handoff',
    index: index++,
    imageLocation: 'assets/handoff.png'
  });

  return animation;
}

function getAnimationAnswer(queryParams: any): MicroAnimation[] {
  // No params
  // During answer - neutral expression

  let animation: MicroAnimation[] = [];
  let index = 0;

  animation.push({
    name: 'Answer',
    index: index++,
    imageLocation: 'assets/neutral.png'
  });

  return animation;
}

function getAnimationWait(queryParams: any): MicroAnimation[] {
  // No params
  // During wait - neutral expression

  let animation: MicroAnimation[] = [];
  let index = 0;

  animation.push({
    name: 'Wait',
    index: index++,
    imageLocation: 'assets/headTiltRight.png'
  });

  animation.push({
    name: 'Wait',
    index: index++,
    imageLocation: 'assets/neutral.png'
  });

  animation.push({
    name: 'Wait',
    index: index++,
    imageLocation: 'assets/headTiltLeft.png'
  });

  return animation;
}

function getAnimationFarewell(queryParams: any): MicroAnimation[] {
  // No params
  // During farewell - arm raised

  let animation: MicroAnimation[] = [];
  let index = 0;

  animation.push({
    name: 'Farewell',
    index: 0,
    imageLocation: 'assets/armRaise.png'
  });

  return animation;
}

function getAnimationIdle(): MicroAnimation[] {

  let animation: MicroAnimation[] = [];
  let index = 0;

  animation.push({
    name: 'Idle',
    index: 0,
    imageLocation: 'assets/neutral.png'
  });

  return animation;
}

export default router;
