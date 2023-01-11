import express from 'express';
import getDefaultText from '../services/robotTextService';


const router = express.Router();

router.get('/:type', (req, res) => {
  try {
    let text: string = getDefaultText(req.params.type);

    res.json(text);
  } catch (e) {
    res.status(500).send(e);
  }
});

export default router;
