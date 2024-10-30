import { describe, test, expect, afterAll } from '@jest/globals';

import request from 'supertest';
import app from '.';
import db from '../db';

test('not found 404', async function () {
  const resp = await request(app).get('/not-a-path');
  expect(resp.statusCode).toEqual(404);
});

afterAll(function () {
  db.end();
});
