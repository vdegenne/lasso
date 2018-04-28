import {expect} from 'chai';

import {getLatestFilename, touchFile} from '../util';

const root = `${__dirname}/../../fixtures`;


suite('Utils', () => {
  test('returns the latest file', async() => {
    let latestFile;
    // public-file.txt is the latest
    await touchFile(root + '/public-file.txt');
    latestFile = await getLatestFilename(root);
    expect(latestFile).to.equal('public-file.txt');
    // private-file.txt is the latest
    await touchFile(root + '/private-file.txt');
    latestFile = await getLatestFilename(root);
    expect(latestFile).to.equal('private-file.txt');
  });
});