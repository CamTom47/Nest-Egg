import { describe, test, expect, afterEach, afterAll, beforeEach, beforeAll, jest } from '@jest/globals';
import request from 'supertest';
import app from '../../index';
import { BadRequestError, NotFoundError, UnauthorizedError } from '../../ExpressError';

import {
  commonAfterAll,
  commonAfterEach,
  commonBeforeAll,
  commonBeforeEach,
  testCategoryIds,
  testUserIds,
  testBudgetIds,
  testBudgetDates,
  u1token,
  u2token,
} from '../../testCommon';
import exp from 'constants';

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

describe('POST /auth/login', () => {
  test('works', async () => {
    const data = {
      username: 'testUser',
      password: 'testPassword',
    };
    const resp = await request(app).post(`/auth/login`).send(data);

    expect(resp.status).toEqual(200);
    expect(resp.body).toEqual({
      user: {
        id: expect.any(Number),
        username: 'testUser',
        firstName: 'testF',
        lastName: 'testL',
        email: 'test@test.com',
        isAdmin: true,
      },
    });
  });
});

describe('POST /auth/register', () => {
  test('works', async () => {
    const data = {
      firstName: 'userNewF',
      lastName: 'userNewL',
      username: 'userNew',
      password: 'testPassword123!',
      email: 'test@test.com',
      isAdmin: true,
    };
    const resp = await request(app).post(`/auth/register`).send(data);

    expect(resp.status).toEqual(201);
    expect(resp.body).toEqual({
      user: {
        id: expect.any(Number),
        firstName: 'userNewF',
        lastName: 'userNewL',
        username: 'userNew',
        email: 'test@test.com',
        isAdmin: true,
      },
    });
  });
});
