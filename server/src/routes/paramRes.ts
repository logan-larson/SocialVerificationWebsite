import express from 'express';
import {ParameterResult} from '../models/parameterResult';
import getDefaultParams from '../services/defaultParams'


const router = express.Router();

router.get('/:type', (req, res) => {
  try {
    let dftParamRes: ParameterResult[] | undefined = getDefaultParams(req.params.type);

    if (dftParamRes) {
      res.json(dftParamRes);
    } else {
      res.status(404).send(`Default parameters of ${req.params.type} not found`);
    }
  } catch (e) {
    res.status(500).send(e);
  }
});

export default router;
