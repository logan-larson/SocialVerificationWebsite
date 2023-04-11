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
          animation = getGreeterAnimation(req.query);
          break;
        case 'Farewell':
          animation = getFarewellAnimation(req.query);
          break;
        default:
          animation = getIdleAnimation();
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

function getGreeterAnimation(queryParams: any): MicroAnimation[] {

  let animation: MicroAnimation[] = [];

  animation.push({
    name: 'Greeter',
    index: 0,
    imageLocation: 'assets/robotImages/greeter/armRaise.png'
  });

  if (queryParams != undefined && queryParams['handshake'] == 'true') {
    animation.push({
      name: 'Greeter',
      index: 1,
      imageLocation: 'assets/robotImages/greeter/handoff.png'
    });
  }

  return animation;
}

function getFarewellAnimation(queryParams: any): MicroAnimation[] {

  let animation: MicroAnimation[] = [];

  animation.push({
    name: 'Farewell',
    index: 0,
    imageLocation: 'assets/robotImages/farewell/armRaise.png'
  });

  return animation;
}

function getIdleAnimation(): MicroAnimation[] {

  let animation: MicroAnimation[] = [];

  animation.push({
    name: 'Idle',
    index: 0,
    imageLocation: 'assets/robotImages/neutral.png'
  });

  return animation;
}

export default router;
