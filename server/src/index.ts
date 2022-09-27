import express, { Express, Request, Response } from 'express';
import verification from './routes/verification';
import microtypes from './routes/microtype';
import dotenv from 'dotenv'; // Used to get port from environment

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

/* Link static files */
app.use(express.static(__dirname + '/public'));

/* Middleware */
app.use(express.json());

/* Routes */
app.use('/api/verification', verification);
app.use('/api/microtypes', microtypes);

/* Serve front-end */
app.get('*', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

app.listen(port, () => {
  console.log('Server listening on port ' + port);
});
