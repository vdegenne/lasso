import {existsSync} from 'fs';
import * as path from 'path';


if (!process.env.RANCH) {
  console.error('The RANCH environment variable was not defined.');
  process.exit(1);
}

let RANCH = path.resolve(process.env.RANCH);

if (!existsSync(RANCH)) {
  console.error('The ranch doesn\'t exist.');
  process.exit(1);
}


export {RANCH};
