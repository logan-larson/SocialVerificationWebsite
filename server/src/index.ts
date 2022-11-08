import express, { Express } from 'express';
import verification from './routes/verification';
import microtypes from './routes/microtype';
import paramres from './routes/paramRes';
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
app.use('/api/paramres', paramres);

/* Serve front-end */
// The _ indicates the first parameter is not being used, same as Haskell
app.get('*', (_, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

app.listen(port, () => {
  console.log('Server listening on port ' + port);
});
