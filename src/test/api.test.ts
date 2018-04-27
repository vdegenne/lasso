import * as chai from 'chai';
import * as supertest from 'supertest';
import { api } from '../api';
import { Response } from 'superagent';


const expect = chai.expect;


suite('Api', () => {
  test('public-file.txt is public', async () => {
    await supertest(api).get('/public-file.txt').expect((res: Response) => {
      expect(res.status).to.equal(200);
    });
  });

  test('private-file.txt is private (Unauthorized)', async () => {
    await supertest(api).get('/private-file.txt').expect((res: Response) => {
      expect(res.status).to.equal(401);
    });
  });

  test('bob can access the private-file.txt', async () => {
    const token = Buffer.from('bob:superpass').toString('base64');

    await supertest(api)
      .get('/private-file.txt')
      .set('Authorization', `Basic ${token}`)
      .expect((res: Response) => {
        expect(res.status).to.equal(200);
      });
  });
});
