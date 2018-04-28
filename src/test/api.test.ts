import * as chai from 'chai';
import {Response} from 'superagent';
import * as supertest from 'supertest';

import {api} from '../api';
import {touchFile} from '../util';


const expect = chai.expect;
const root = `${__dirname}/../../fixtures`;


suite('Api', () => {
  test('public-file.txt is public', async() => {
    await supertest(api).get('/public-file.txt').expect((res: Response) => {
      expect(res.status).to.equal(200);
    });
  });

  test('private-file.txt is private (Unauthorized)', async() => {
    await supertest(api).get('/private-file.txt').expect((res: Response) => {
      expect(res.status).to.equal(401);
    });
  });

  test('bob can access the private-file.txt', async() => {
    const token = Buffer.from('bob:superpass').toString('base64');

    await supertest(api)
        .get('/private-file.txt')
        .set('Authorization', `Basic ${token}`)
        .expect(200);
  });

  test('/latest refers to the latest file', async() => {
    // public is the latest, 200
    touchFile(root + '/public-file.txt');
    await supertest(api).get('/latest').expect(200);
    // private is the latest, 401
    touchFile(root + '/private-file.txt');
    await supertest(api).get('/latest').expect(401);
  });
});
