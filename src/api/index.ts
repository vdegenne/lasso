import * as express from 'express';
import * as path from 'path';

import {Basic} from '../auth/basic';
import {RANCH} from '../config';

import {lassoRouter} from './lasso.router';

const api: express.Express = express();

// use morgan
if (!(process.env.NODE_ENV && process.env.NODE_ENV === 'test')) {
  api.use(require('morgan')('dev'));
}

api.use(express.json());
api.use(express.urlencoded({extended: true}));

// authentication barrier.
const basic = new Basic({file: path.join(RANCH, '.lasso.passwd')});

api.use((req, res, next) => {
  basic.check(req, res, (err: Error) => {
    if (err) {
      next(err);
    } else {
      next();
    }
  });
});


// lasso
api.use(lassoRouter);

export default api;
