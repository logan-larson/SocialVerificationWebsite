import express from 'express';
import { MicroType } from '../models/microType';
import { getMicroType } from '../models/trackedMicroTypes';
import { MicroAnimation } from '../models/microAnimation';


const router = express.Router();

router.get('/:type', (req, res) => {
  try {
    let mt: MicroType | undefined = getMicroType(req.params.type);

    if (mt) {
      let animation: MicroAnimation[] = [];

      switch (mt.type) {
        case 'Greeter':
          // animation = getGreeterAnimation();
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




export default router;
