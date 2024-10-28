import { describe, test, expect, afterEach, afterAll, beforeEach, beforeAll } from '@jest/globals';
import request from 'supertest';
import app from '../../index';
import { BadRequestError, NotFoundError } from '../../ExpressError';

import {
  commonAfterAll,
  commonAfterEach,
  commonBeforeAll,
  commonBeforeEach,
  testCategoryIds,
  testUserIds,
  u1token,
  u2token,
} from '../../testCommon';

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

describe('GET /', () => {
  test('works', async () => {
    const resp = await request(app).get('/categories').set('authorization', `Bearer ${u1token}`);

    expect(resp.body).toEqual({
      categories: [
        { id: expect.any(Number), name: 'testCategory', description: 'test description 1' },
        { id: expect.any(Number), name: 'testCategory2', description: 'test description 2' },
      ],
    });

    expect(resp.statusCode).toEqual(200);
  });

  test('works when a user_id is passed into req.body', async () => {
    const data = {
      user_id: testUserIds[1],
    };

    const resp = await request(app).get('/categories').set('authorization', `Bearer ${u1token}`).send(data);

    expect(resp.body).toEqual({
      categories: [
        { id: expect.any(Number), name: 'testCategory', description: 'test description 1' },
        { id: expect.any(Number), name: 'testCategory2', description: 'test description 2' },
        { id: expect.any(Number), name: 'testCategory3', description: 'test description 3' },
      ],
    });

    expect(resp.statusCode).toEqual(200);
  });

  test('throws error with invalid user_id', async () => {
    const resp = await request(app)
      .get('/categories')
      .set('authorization', `Bearer ${u1token}`)
      .send({ user_id: 9999 });

    expect(resp.body).toEqual({
      categories: [
        { id: expect.any(Number), name: 'testCategory', description: 'test description 1' },
        { id: expect.any(Number), name: 'testCategory2', description: 'test description 2' },
      ],
    });
  });
});

describe('GET /categories/:category_id', () => {
  test('works', async () => {
    const categoryId = testCategoryIds[0]
    const resp = await request(app).get(`/categories/${categoryId}`).set("authorization", `Bearer ${u1token}`);

    expect(resp.body).toEqual({
      category: { id: expect.any(Number), name: 'testCategory', description: 'test description 1' }
    });
    expect(resp.status).toEqual(200)

  });
  test('throws NotFoundError with invalid category id', async () => {
    const resp = await request(app).get(`/categories/9999`).set("authorization", `Bearer ${u1token}`);
    expect(resp.body.error.message).toEqual("Not Found");
  });
});

describe("POST /", () => { 
  test('works', async() => {
    const data = {
      "name": 'new category',
      "description": 'new description',
      "userId": testUserIds[0]
    }

    const resp = await request(app).post("/categories").set("authorization", `Bearer ${u1token}`).send(data);

    expect(resp.body).toEqual({
      category: {
        id: expect.any(Number),
        name: "new category",
        description: "new description",
        userId: testUserIds[0]
      }
    })

    expect(resp.status).toEqual(201)

  })
  test('throw error with incomplete data', async () => {
    const data = {
      name: 'new category',
      user_id: testUserIds[0]
    }

    const resp = await request(app).post("/categories").set("authorization", `Bearer ${u1token}`).send(data);

    expect(resp.badRequest).toEqual(true)
    expect(resp.status).toEqual(400)
    
  })
})

describe("PATCH /:category_id", () => {
  test('works', async () => { 
    const data = {
      "name": 'update category',
      "description": 'update description',
      "userId": testUserIds[0]
    }  

    const resp = await request(app).patch(`/categories/${testCategoryIds[3]}`).set('authorization', `Bearer ${u1token}`).send(data);

    expect(resp.body).toEqual({
      category: {
      id: testCategoryIds[3],
      "name": 'update category',
      "description": 'update description',
      "userId": testUserIds[0]
    }});

    expect(resp.status).toEqual(200);
  })

  test('throw error with invalid category_id data', async () => {
    const data = {
      name: 'update category'
    }

    const resp = await request(app).patch("/categories/99999").set("authorization", `Bearer ${u1token}`).send(data);

    expect(resp.notFound).toEqual(true)
    expect(resp.status).toEqual(404)
    
  })
})

describe("DELETE /:category_id", () => {
  test('works', async () => {
    const resp  = await request(app).delete(`/categories/${testCategoryIds[0]}`).set('authorization', `bearer ${u1token}`)
    expect(resp.body.category.message).toEqual('Category Deleted');
  })
})
