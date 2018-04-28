import {closeSync, exists, existsSync, lstatSync, openSync, readdirSync} from 'fs';
import {join} from 'path';
import {promisify} from 'util';

/**
 * getLatestFilename
 */
export async function getLatestFilename(dirpath: string): Promise<string> {
  if (!existsSync(dirpath)) {
    console.error(`${dirpath} doesn't exist.`);
    return;
  }

  let latest: any;

  const files = readdirSync(dirpath);
  files.forEach((filename: any) => {
    // Get the stat
    const stat = lstatSync(join(dirpath, filename));
    // Pass if it is a directory
    if (stat.isDirectory())
      return;
    // latest default to first file
    if (!latest) {
      latest = {filename, mtime: stat.mtime};
      return;
    }
    // update latest if mtime is greater than the current latest
    if (stat.mtime > latest.mtime) {
      latest.filename = filename;
      latest.mtime = stat.mtime;
    }
  });

  return latest.filename;
}


/**
 * touchFile
 */
export function touchFile(filepath: string) {
  closeSync(openSync(filepath, 'w'));
}

/**
 * isDirectory
 */
export function isDirectory(path: string) {
  const exists = existsSync(path);
  if (!exists) {
    return false;
  }
  return lstatSync(path).isDirectory();
}