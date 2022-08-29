import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

app.get('/verify', (req: Request, res: Response) => {
  res.send('Hello there');
});

app.listen(port, () => {
  console.log('Server listening on port ' + port);
});
