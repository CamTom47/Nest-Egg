import request from 'supertest';
import { describe, test, expect, afterAll, afterEach, beforeAll, beforeEach } from '@jest/globals';
import app from '../../index'
import Subcategory from '@/models/subcategory/subcategory';

import { BadRequestError, NotFoundError } from '../../ExpressError';

import {
  commonAfterAll,
  commonAfterEach,
  commonBeforeAll,
  commonBeforeEach,
  testCategoryIds,
  testSubcategoryIds,
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
    const resp = await request(app).get('/subcategories').set('authorization', `Bearer ${u1token}`);

    expect(resp.body).toEqual({
      subcategories: [
        { id: expect.any(Number), name: 'testSubcategory', description: 'test description 1', categoryId: testCategoryIds[0], userId: testUserIds[0]},
        { id: expect.any(Number), name: 'testSubcategory2', description: 'test description 2', categoryId: testCategoryIds[0], userId: testUserIds[0]},
      ],
    });

    expect(resp.statusCode).toEqual(200);
  });

  test('works when a user_id is passed into req.body', async () => {
    const data = {
      user_id: testUserIds[1],
    };

    const resp = await request(app).get('/subcategories').set('authorization', `Bearer ${u1token}`).send(data);

    expect(resp.body).toEqual({
      subcategories: [
        { id: expect.any(Number), name: 'testSubcategory', description: 'test description 1', categoryId: testCategoryIds[0], userId: testUserIds[0]},
        { id: expect.any(Number), name: 'testSubcategory2', description: 'test description 2', categoryId: testCategoryIds[0], userId: testUserIds[0]},
        { id: expect.any(Number), name: 'testSubcategory3', description: 'test description 3', categoryId: testCategoryIds[1], userId: testUserIds[1]}

      ],
    });

    expect(resp.statusCode).toEqual(200);
  });

  test('returns default subcategories when invalid user_id is used', async () => {
    const resp = await request(app)
      .get('/subcategories')
      .set('authorization', `Bearer ${u1token}`)
      .send({ user_id: 9999 });

    expect(resp.body).toEqual({
      subcategories: [
        { id: expect.any(Number), name: 'testSubcategory', description: 'test description 1', categoryId: testCategoryIds[0], userId: testUserIds[0] },
        { id: expect.any(Number), name: 'testSubcategory2', description: 'test description 2', categoryId: testCategoryIds[0], userId: testUserIds[0] },
      ],
    });
  });
});

describe('GET /subcategories/:subcategory_id', () => {
  test('works', async () => {
    const subcategoryId = testSubcategoryIds[0]
    const resp = await request(app).get(`/subcategories/${subcategoryId}`).set("authorization", `Bearer ${u1token}`);

    expect(resp.body).toEqual({
        subcategory: { id: expect.any(Number), name: 'testSubcategory', description: 'test description 1', categoryId: testCategoryIds[0], userId: testUserIds[0]},
    });
    expect(resp.status).toEqual(200)

  });
  test('throws NotFoundError with invalid subcategory_id', async () => {
    const resp = await request(app).get(`/subcategories/9999`).set("authorization", `Bearer ${u1token}`);
    expect(resp.body.error.message).toEqual("Not Found");
  });
});

describe("POST /", () => { 
  test('works', async() => {
    const data = {
      "name": 'new subcategory',
      "description": 'new description',
      "categoryId": testCategoryIds[0],
      "userId": testUserIds[0]
    }

    const resp = await request(app).post("/subcategories").set("authorization", `Bearer ${u1token}`).send(data);

    expect(resp.body).toEqual({
      subcategory: {
        id: expect.any(Number),
        name: "new subcategory",
        description: "new description",
        categoryId: testCategoryIds[0],
        userId: testUserIds[0]
      }
    })

    expect(resp.status).toEqual(201)

  })
  test('throw error with incomplete data', async () => {
    const data = {
      name: 'new subcategory',
      user_id: testUserIds[0]
    }

    const resp = await request(app).post("/subcategories").set("authorization", `Bearer ${u1token}`).send(data);

    expect(resp.badRequest).toEqual(true)
    expect(resp.status).toEqual(400)
    
  })
})

describe("PATCH /subcategories/:subcategory_id", () => {
  test('works', async () => { 
    const data = {
      "name": 'update subcategory',
      "description": 'update description',
      "categoryId": testCategoryIds[2],
      "userId": testUserIds[0]
    }  

    const resp = await request(app).patch(`/subcategories/${testSubcategoryIds[2]}`).set('authorization', `Bearer ${u1token}`).send(data);

    expect(resp.body).toEqual({
      subcategory: {
      "id": testSubcategoryIds[2],
      "name": 'update subcategory',
      "description": 'update description',
      "categoryId": testCategoryIds[2],
      "userId": testUserIds[0]
    }});

    expect(resp.status).toEqual(200);
  })

  test('throw error with invalid subcategory_id data', async () => {
    const data = {
      name: 'update subcategory'
    }

    const resp = await request(app).patch("/subcategories/99999").set("authorization", `Bearer ${u1token}`).send(data);

    expect(resp.notFound).toEqual(true)
    expect(resp.status).toEqual(404)
    
  })
})

describe("DELETE /:subcategory_id", () => {
  test('works', async () => {
    const resp  = await request(app).delete(`/subcategories/${testSubcategoryIds[0]}`).set('authorization', `bearer ${u1token}`)
    expect(resp.body.subcategory.message).toEqual('Subcategory Deleted');
  })
})
