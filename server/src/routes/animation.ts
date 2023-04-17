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

  let animation: MicroAnimation[] = [];
  let index = 0;

  animation.push({
    name: 'Greeter',
    index: index++,
    imageLocation: 'assets/robotImages/greeter/armRaise.png'
  });

  if (queryParams != undefined && queryParams['handshake'] == 'true') {
    animation.push({
      name: 'Greeter',
      index: index++,
      imageLocation: 'assets/robotImages/greeter/handoff.png'
    });
  }

  return animation;
}

function getAnimationAsk(queryParams: any): MicroAnimation[] {

  let animation: MicroAnimation[] = [];
  let index = 0;

  animation.push({
    name: 'Ask',
    index: index++,
    imageLocation: 'assets/robotImages/ask/headTiltRight.jpg'
  });

  return animation;
}

function getAnimationRemark(queryParams: any): MicroAnimation[] {
  let animation: MicroAnimation[] = [];
  let index = 0;

  animation.push({
    name: 'Remark',
    index: index++,
    imageLocation: 'assets/robotImages/remark/temp.png'
  });

  return animation;
}

function getAnimationInstruction(queryParams: any): MicroAnimation[] {
  let animation: MicroAnimation[] = [];
  let index = 0;

  animation.push({
    name: 'Instruction',
    index: index++,
    imageLocation: 'assets/robotImages/instruction/temp.png'
  });

  return animation;
}

function getAnimationHandoff(queryParams: any): MicroAnimation[] {
  let animation: MicroAnimation[] = [];
  let index = 0;

  animation.push({
    name: 'Handoff',
    index: index++,
    imageLocation: 'assets/robotImages/handoff/temp.png'
  });

  return animation;
}

function getAnimationAnswer(queryParams: any): MicroAnimation[] {
  let animation: MicroAnimation[] = [];
  let index = 0;

  animation.push({
    name: 'Answer',
    index: index++,
    imageLocation: 'assets/robotImages/answer/temp.png'
  });

  return animation;
}

function getAnimationWait(queryParams: any): MicroAnimation[] {
  let animation: MicroAnimation[] = [];
  let index = 0;

  animation.push({
    name: 'Wait',
    index: index++,
    imageLocation: 'assets/robotImages/wait/temp.png'
  });

  return animation;
}

function getAnimationFarewell(queryParams: any): MicroAnimation[] {

  let animation: MicroAnimation[] = [];
  let index = 0;

  animation.push({
    name: 'Farewell',
    index: 0,
    imageLocation: 'assets/robotImages/farewell/armRaise.png'
  });

  return animation;
}

function getAnimationIdle(): MicroAnimation[] {

  let animation: MicroAnimation[] = [];
  let index = 0;

  animation.push({
    name: 'Idle',
    index: 0,
    imageLocation: 'assets/robotImages/neutral.png'
  });

  return animation;
}

export default router;
