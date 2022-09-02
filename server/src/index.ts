import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

app.use(express.static(__dirname + '/public'));

app.get('/api/verify', (req: Request, res: Response) => {
  res.json('Hello there');
});

app.get('*', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

app.listen(port, () => {
  console.log('Server listening on port ' + port);
});
