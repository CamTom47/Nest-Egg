import { describe, test, expect, afterEach, afterAll, beforeEach, beforeAll, jest } from '@jest/globals';
import request from 'supertest';
import app from '../../index';
import { BadRequestError, NotFoundError, UnauthorizedError } from '../../ExpressError';

import {
  commonAfterAll,
  commonAfterEach,
  commonBeforeAll,
  commonBeforeEach,
  testUserIds,
  testBudgetIds,
  u1token,
  u2token,
  u3token,
  testAllocationIds,
  testSubcategoryIds,
} from '../../testCommon';

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

describe('GET /categories ', () => {
  test('works with admin', async () => {
    const resp = await request(app).get('/admins/allocations').set('authorization', `Bearer ${u1token}`);

    expect(resp.status).toEqual(200);
    expect(resp.body).toEqual({
      allocations: [
        {
          id: testAllocationIds[0],
          amount: '$200.00',
          subcategoryId: testSubcategoryIds[0],
          budgetId: testBudgetIds[0],
          userId: testUserIds[0],
        },
        {
          id: testAllocationIds[1],
          amount: '$500.00',
          subcategoryId: testSubcategoryIds[1],
          budgetId: testBudgetIds[1],
          userId: testUserIds[0],
        },
        {
          id: testAllocationIds[2],
          amount: '$770.00',
          subcategoryId: testSubcategoryIds[1],
          budgetId: testBudgetIds[2],
          userId: testUserIds[1],
        },
      ],
    });
  });
})