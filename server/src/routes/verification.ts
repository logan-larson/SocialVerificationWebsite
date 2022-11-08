import express from 'express';
import {Interaction} from '../models/interaction';
import {Violation} from '../models/violation';
import verifyModel from '../services/verificationService';

const router = express.Router();

router.post('/', (req, res) => {
  try {
    let interaction: Interaction = req.body;

    let violations: Violation[] = verifyModel(interaction);

    res.json(violations);
  } catch (e) {
    console.log(JSON.stringify(e));
    res.status(500).send(e);
  }
});

export default router;
