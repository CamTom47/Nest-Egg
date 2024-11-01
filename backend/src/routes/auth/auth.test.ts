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
  u2token
} from '../../testCommon';

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

describe("POST /users", () => {
    test('works', async () => {
        const data = {
            firstName: 'userNewF',
            lastName: 'userNewL',
            username: 'userNew',
            password: 'password',
            email: 'test@test.com',
            isAdmin: true
        }
        const resp = await request(app).post(`/users`).set('authorization', `Bearer ${u1token}`).send(data)

        expect(resp.status).toEqual(201);
        expect(resp.body).toEqual({
            firstName: 'userNewF',
            lastName: 'userNewL',
            username: 'userNew',
            password: 'password',
            email: 'test@test.com',
            isAdmin: true
        });
    })    
})