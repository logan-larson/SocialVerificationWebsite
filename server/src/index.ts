import express, { Express, Request, Response } from 'express';
import verification from './routes/verification';
import dotenv from 'dotenv';
import * as bodyParser from 'body-parser';

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

/* Link static files */
app.use(express.static(__dirname + '/public'));

/* Middle-ware operations */
app.use(bodyParser.json());

/* Routes */
app.use('/api/verification', verification);

/* Serve front-end */
app.get('*', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

app.listen(port, () => {
  console.log('Server listening on port ' + port);
});
