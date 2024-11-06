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
  testBudgetDates,
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

describe('GET /', () => {
  test('works with admin', async () => {
    const resp = await request(app).get('/allocations').set('authorization', `Bearer ${u1token}`);
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
  test('returns all allocations created by a user. Admin/correct user', async () => {
    const resp = await request(app).get(`/allocations?userId=${testUserIds[1]}`).set('authorization', `Bearer ${u1token}`);

    expect(resp.status).toEqual(200);
    expect(resp.body).toEqual({
      allocations: [
        {
          id: testAllocationIds[2],
          amount: '$770.00',
          subcategoryId: testSubcategoryIds[1],
          budgetId: testBudgetIds[2],
          userId: testUserIds[1],
        }
      ],
    });
  });
  test('returns all allocations created by a user. non admin / correct user', async () => {
    const resp = await request(app).get(`/allocations?userId=${testUserIds[1]}`).set('authorization', `Bearer ${u2token}`);

    expect(resp.status).toEqual(200);
    expect(resp.body).toEqual({
      allocations: [
        {
          id: testAllocationIds[2],
          amount: '$770.00',
          subcategoryId: testSubcategoryIds[1],
          budgetId: testBudgetIds[2],
          userId: testUserIds[1],
        }
      ],
    });
  });
  test('throws error if not correct user and not admin', async () => {
    const resp = await request(app).get(`/allocations?userId=${testUserIds[1]}`).set('authorization', `Bearer ${u3token}`);

    expect(resp.body).toEqual({ error: { message: 'Unauthorized', status: 401 } });
  });
});

describe('GET /allocations/:allocation_id', () => {
  test('works with admin/correct user ', async () => {
    const resp = await request(app)
      .get(`/allocations/${testAllocationIds[0]}`)
      .set('authorization', `Bearer ${u1token}`);

    expect(resp.body).toEqual({
      allocation: {
        id: testAllocationIds[0],
        amount: '$200.00',
        subcategoryId: testSubcategoryIds[0],
        budgetId: testBudgetIds[0],
        userId: testUserIds[0],
      },
    });
  });

  test('works with admin/not correct user', async () => {
    const resp = await request(app)
      .get(`/allocations/${testAllocationIds[2]}`)
      .set('authorization', `Bearer ${u1token}`);

    expect(resp.body).toEqual({
      allocation: {
        id: testAllocationIds[2],
        amount: '$770.00',
        subcategoryId: testSubcategoryIds[1],
        budgetId: testBudgetIds[2],
        userId: testUserIds[1],
      },
    });
  });

  test('works with not admin/correct user', async () => {
    const resp = await request(app)
      .get(`/allocations/${testAllocationIds[2]}?userId=${testUserIds[1]}`)
      .set('authorization', `Bearer ${u2token}`);
    expect(resp.body).toEqual({
      allocation: {
        id: testAllocationIds[2],
        amount: '$770.00',
        subcategoryId: testSubcategoryIds[1],
        budgetId: testBudgetIds[2],
        userId: testUserIds[1],
      },
    });
  });

  test('throw error if not admin and not correct user', async () => {
    const resp = await request(app)
      .get(`/allocations/${testAllocationIds[0]}?userId=${testUserIds[0]}`)
      .set('authorization', `Bearer ${u2token}`);

    expect(resp.body).toEqual({ error: { message: 'Unauthorized', status: 401 } });
  });
});

describe('POST /', () => {
  test('works', async () => {
    const data = {
      amount: 350.05,
      budgetId: testBudgetIds[0],
      subcategoryId: testSubcategoryIds[1],
      userId: testUserIds[2],
    };
    const resp = await request(app).post('/allocations').set('authorization', `Bearer ${u3token}`).send(data);

    expect(resp.status).toEqual(201);
    expect(resp.body).toEqual({
      allocation: {
        id: expect.any(Number),
        amount: "$350.05",
        budgetId: testBudgetIds[0],
        subcategoryId: testSubcategoryIds[1]
      },
    });
  });

  test('throws error when not logged in', async () => {
    const data = {
      amount: 350.05,
      budget_id: testBudgetIds[0],
      subcategory_id: testSubcategoryIds[1],
      user_id: testUserIds[2],
    };

    const resp = await request(app).post('/allocations/').send(data);

    expect(resp.status).toEqual(401);
    expect(resp.body).toEqual({ error: { message: 'Unauthorized', status: 401 } });
  });
});

describe('PATCH /allocations/:allocation_id', () => {
  test('works when admin/not correct user', async () => {
    const data = {
      amount: 5290.00
    }

    const resp = await request(app)
      .patch(`/allocations/${testAllocationIds[2]}`)
      .set('authorization', `Bearer ${u1token}`)
      .send(data);
    expect(resp.status).toEqual(200);
    expect(resp.body).toEqual({
      allocation: {
        id: testAllocationIds[2],
        amount: '$5,290.00',
        subcategoryId: testSubcategoryIds[1],
        budgetId: testBudgetIds[2],
      }
    });
  });

  test('works when not admin/correct user', async () => {
    const data = {
      amount: 5290.00
    }

    const resp = await request(app)
      .patch(`/allocations/${testAllocationIds[2]}?userId=${testUserIds[1]}`)
      .set('authorization', `Bearer ${u2token}`)
      .send(data);
    expect(resp.status).toEqual(200);
    expect(resp.body).toEqual({
      allocation: {
        id: testAllocationIds[2],
        amount: '$5,290.00',
        subcategoryId: testSubcategoryIds[1],
        budgetId: testBudgetIds[2],
      }
    });
  });

  test('throws error when not admin/not correct user', async () => {
    const data = {};

    const resp = await request(app)
      .patch(`/allocations/${testBudgetIds[0]}?userId=${testUserIds[0]}`)
      .set('authorization', `Bearer ${u2token}`)
      .send(data);
    expect(resp.status).toEqual(401);
    expect(resp.body).toEqual({ error: { message: 'Unauthorized', status: 401 } });
  });

  test('throws error when invalid allocation_id', async () => {
    const data = {
      amount: 5290.00
    }

    const resp = await request(app).patch(`/allocations/9999}`).set('authorization', `Bearer ${u2token}`).send(data);
    expect(resp.body).toEqual({ error: { message: 'Unauthorized', status: 401 } });
  });
});

describe('DELETE /allocations/:allocation_id', () => {
  test('works when admin/not correct user', async () => {
    const resp = await request(app)
      .delete(`/allocations/${testAllocationIds[2]}?userId=${testUserIds[1]}`)
      .set('authorization', `Bearer ${u1token}`);
    expect(resp.body).toEqual({ message: 'Allocation deleted' });
  });
  test('works when not admin/correct user', async () => {
    const resp = await request(app)
      .delete(`/allocations/${testAllocationIds[2]}?userId=${testUserIds[1]}`)
      .set('authorization', `Bearer ${u2token}`);
    expect(resp.body).toEqual({ message: 'Allocation deleted' });
  });
  test('throws error when not admin/ not correct user', async () => {
    const resp = await request(app)
      .delete(`/allocations/${testAllocationIds[1]}?userId=${testUserIds[0]}`)
      .set('authorization', `Bearer ${u2token}`);
    expect(resp.body).toEqual({ error: { message: 'Unauthorized', status: 401 } });
  });
});
