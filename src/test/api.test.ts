import * as chai from 'chai';
import * as supertest from 'supertest';
import api from '../api';
import {Response} from 'superagent';


const expect = chai.expect;


suite('Api', () => {
  test('Bob is not authorized to access extra-private.txt', async() => {
    await supertest(api).get('/extra-private.txt').expect((res: Response) => {
      expect(res.status).to.equal(401);
    });
  });
});
