import { Basic } from 'basic-auth-http';
import { Router } from 'express';
import { createReadStream, existsSync, lstatSync, readFileSync } from 'fs';
import { makeItSquare } from 'make-it-square';
import { basename, dirname, join } from 'path';
import { parse as parseUrl } from 'url';

import { RANCH } from '../config';


const router: Router = Router();
let publicPaths: string[];


// auth
const auth = new Basic({ file: join(RANCH, '.lasso.passwd') });
router.use((req: any, res, next) => {

  // We refresh the public paths to every request
  publicPaths = getPublicPaths();
  const urlpath = parseUrl(req.url).pathname;
  const filepath = join(RANCH, urlpath);

  // If the file doesn't exist, just ignore the request
  if (!existsSync(filepath) || lstatSync(filepath).isDirectory()) {
    res.status(404).end();
    return;
  }
  req.filepath = filepath;

  // Checking if the file is private or not
  if (isPublic(urlpath.substr(1))) {
    next();
    return;
  }

  auth.check(req, res, (err: Error) => {
    if (err) {
      next(err);
    } else {
      next();
    }
  });
});

// get
router.get('*', async (req: any, res) => {
  createReadStream(req.filepath).pipe(res);

});

export { router as lassoRouter };


function getPublicPaths(): string[] {
  const filepath = join(RANCH, '.lasso.public');
  if (existsSync(filepath)) {
    return readFileSync(filepath).toString().replace(/\r\n/g, '\n').split('\n');
  }
}

function isPublic(urlpath: string): boolean {
  if (publicPaths.includes(urlpath)) {
    return true;
  } else if (publicPaths.includes(dirname(urlpath))) {
    return true;
  } else {
    return false;
  }
}