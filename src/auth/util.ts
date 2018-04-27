import {createHash} from 'crypto';


export const sha1 = (input: string) => {
  const hash = createHash('sha1');
  hash.update(input);

  return hash.digest('hex');
}
