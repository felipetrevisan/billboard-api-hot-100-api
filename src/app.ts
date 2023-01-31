import cors from 'cors';
import { config } from 'dotenv-flow';
import express from 'express';

import { router } from './routes';

config({ silent: true });

const app = express();

app.use(
  cors({
    exposedHeaders: ['x-total-count', 'Content-Type', 'Content-Length'],
  })
);

app.use(
  express.json({
    type: ['application/json', 'text/plain'],
  })
);

app.use(router);

export { app };

