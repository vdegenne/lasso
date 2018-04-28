import {Basic} from 'basic-auth-http';
import {Router} from 'express';
import {closeSync, createReadStream, existsSync, lstatSync, openSync, readFileSync, readdirSync} from 'fs';
import {makeItSquare} from 'make-it-square';

import {basename, dirname, join, resolve} from 'path';
import {parse as parseUrl} from 'url';

import {RANCH} from '../config';
import {getLatestFilename, isDirectory} from '../util';


const router: Router = Router();
let publicPaths: string[];
let commands = ['latest'];


// auth
const auth = new Basic({file: join(RANCH, '.lasso.passwd')});
router.use(async(req: any, res, next) => {

  // vars
  publicPaths = getPublicPaths();  // refresh public file
  let urlpath = parseUrl(req.url).pathname;
  let filepath = join(RANCH, urlpath);
  let filename = basename(filepath);
  const dirpath = dirname(filepath);

  // if filename is a command
  if (commands.includes(filename)) {
    filename = await resolvePathToFilename(
        filename /*command*/, filepath /*unresolved path*/);
    filepath = resolve(dirpath, filename);
    // update the url
    urlpath = resolve(dirname(urlpath) + '/' + filename);
  }


  // If the file doesn't exist, just ignore the request
  if (!existsSync(filepath) || isDirectory(filepath)) {
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
router.get('*', async(req: any, res) => {
  createReadStream(req.filepath).pipe(res);
});

export {router as lassoRouter};


function getPublicPaths(): string[] {
  const filepath = join(RANCH, '.lasso.public');
  if (existsSync(filepath)) {
    return readFileSync(filepath).toString().replace(/\r\n/g, '\n').split('\n');
  } else {
    return [];
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


async function resolvePathToFilename(
    command: string, path: string): Promise<string> {
  const dirpath = dirname(path);

  switch (command) {
    case 'latest':
      return await getLatestFilename(dirpath);
    default:
      return path;
  }
}
