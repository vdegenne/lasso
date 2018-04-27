import {Router} from 'express';
import {createReadStream, existsSync} from 'fs';
import {makeItSquare} from 'make-it-square';


const router: Router = Router();

router.post('*', async(req, res) => {
  res.send('hello');
  // res.send(makeItSquare(req));
  /*   const filepath = path.join(RANCH, req.url);
    if (existsSync(filepath)) {
      createReadStream(filepath).pipe(res);
    } */
});

export {router as lassoRouter};
