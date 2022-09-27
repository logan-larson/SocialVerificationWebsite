import express from 'express';
import { MicroType } from '../models/microType';
import { getMicroType } from '../models/trackedMicroTypes';


const router = express.Router();

router.get('/:type', (req, res) => {
  try {
    let mt: MicroType | undefined = getMicroType(req.params.type);

    if (mt) {
      res.json(mt);
    } else {
      res.status(404).send(`Microtype of ${req.params.type} not found`);
    }
  } catch (e) {
    res.status(500).send(e);
  }
});

export default router;
