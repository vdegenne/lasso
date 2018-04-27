import * as express from 'express';
import * as path from 'path';

import { lassoRouter } from './lasso.router';

const api: express.Express = express();

// use morgan
if (!(process.env.NODE_ENV && process.env.NODE_ENV === 'test')) {
  api.use(require('morgan')('dev'));
}

api.use(express.json());
api.use(express.urlencoded({ extended: true }));


// lasso
api.use(lassoRouter);

export { api };