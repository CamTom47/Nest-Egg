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

describe('GET /users', () => {
  test('works for admin users', async () => {
    const resp = await request(app).get(`/users`).set('authorization', `Bearer ${u1token}`)

    expect(resp.status).toEqual(200);
    expect(resp.body).toEqual({
        users: [
            {id: expect.any(Number), firstName: "testF", lastName: "testL", username: "testUser", email: "test@test.com", isAdmin: true},
            {id: expect.any(Number), firstName: "testF2", lastName: "testL2", username: "testUser2", email: "test@test.com", isAdmin: true}
        ]
    });

  })

  test('throws Unauthorizated error for non admin users', async () => {
    const resp = await request(app).get(`/users`).set('authorization', `Bearer ${u2token}`);

    expect(resp.status).toEqual(401);
    expect(resp.body).toEqual({error: {message: "Unauthorized"}});
  })
});

describe('GET /users/:user_id', () => {
  test('works with admin/correct user ', async () => {
    const resp = await request(app).get(`/users/${testUserIds[0]}`).set('authorization', `Bearer ${u1token}`);

    expect(resp.status).toEqual(200);
    expect(resp.body).toEqual( {id: expect.any(Number), firstName: "testF", lastName: "testL", username: "testUser", email: "test@test.com", isAdmin: true});
  });

  test('works with admin/not correct user', async () => {
    const resp = await request(app).get(`/users/${testUserIds[1]}`).set('authorization', `Bearer ${u1token}`);

    expect(resp.status).toEqual(200);
    expect(resp.body).toEqual({id: expect.any(Number), firstName: "testF2", lastName: "testL2", username: "testUser2", email: "test@test.com", isAdmin: true});
  });

  test('works with not admin/correct user', async () => {
   const resp = await request(app).get(`/users/${testUserIds[1]}`).set('authorization', `Bearer ${u2token}`);

    expect(resp.status).toEqual(200);
    expect(resp.body).toEqual({id: expect.any(Number), firstName: "testF2", lastName: "testL2", username: "testUser2", email: "test@test.com", isAdmin: true});
  });

  test('throw error if not admin and not correct user', async () => {
    const resp = await request(app).get(`/users/${testUserIds[0]}`).set('authorization', `Bearer ${u2token}`);

    expect(resp.status).toEqual(401);
    expect(resp.body).toEqual({error: {message: "Unauthorized"}});
  });

  test('throws error with invalid user id', async () => {
    const resp = await request(app).get(`/users/99999`).set('authorization', `Bearer ${u1token}`);

    expect(resp.status).toEqual(404);
    expect(resp.body).toEqual(NotFoundError);
  });
});

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

describe("PATCH /users/:user_id", () => {
    const data = {
        firstName: 'updateF',
        lastName: 'updateL',
        username: 'updateUser',
    }
    test('works for admin/correct user', async () => {
        const resp = await request(app).patch(`/users/${testUserIds[0]}`).set('authorization', `Bearer ${u1token}`).send(data)

        expect(resp.status).toEqual(200);
        expect(resp.body).toEqual({id: expect.any(Number), firstName: "updateF", lastName: "updateL", username: "updateUser", email: "test@test.com", isAdmin: true});
    })
    test('works for non admin/correct user', async () => {
        const resp = await request(app).patch(`/users/${testUserIds[1]}`).set('authorization', `Bearer ${u2token}`).send(data)

        expect(resp.status).toEqual(200);
        expect(resp.body).toEqual({id: expect.any(Number), firstName: "updateF", lastName: "updateL", username: "updateUser", email: "test@test.com", isAdmin: true});
    })
    test('works for admin/non correct user', async () => {
        const resp = await request(app).patch(`/users/${testUserIds[1]}`).set('authorization', `Bearer ${u1token}`).send(data)

        expect(resp.status).toEqual(200);
        expect(resp.body).toEqual({id: expect.any(Number), firstName: "updateF", lastName: "updateL", username: "updateUser", email: "test@test.com", isAdmin: true});
    })
    test('throws error for non admin/non correct user', async () => {
        const resp = await request(app).patch(`/users/${testUserIds[0]}`).set('authorization', `Bearer ${u2token}`).send(data)

        expect(resp.status).toEqual(401);
        expect(resp.body).toEqual({error: {message: "Unauthorized"}});
    })

    test('throws error with incorrect invalid user id', async () => {
    const resp = await request(app).patch(`/users/9999`).set('authorization', `Bearer ${u1token}`).send(data)

        expect(resp.status).toEqual(404);
        expect(resp.body).toEqual(NotFoundError);
    })
    
})

describe("DELETE /users/:user_id", () => {
    test('works for admin/correct user', async () => {
        const resp = await request(app).delete(`/users/${testUserIds[0]}`).set('authorization', `Bearer ${u1token}`);

        expect(resp.status).toEqual(200);
        expect(resp.body).toEqual({message: "User deleted"});
    })
    test('works for non admin/correct user', async () => {
        const resp = await request(app).delete(`/users/${testUserIds[1]}`).set('authorization', `Bearer ${u2token}`);

        expect(resp.status).toEqual(200);
        expect(resp.body).toEqual({message: "User deleted"});
    })
    test('works for admin/non correct user', async () => {
        const resp = await request(app).delete(`/users/${testUserIds[1]}`).set('authorization', `Bearer ${u1token}`);

        expect(resp.status).toEqual(200);
        expect(resp.body).toEqual({message: "User deleted"});
    })
    test('throws error for non admin/non correct user', async () => {
        const resp = await request(app).delete(`/users/${testUserIds[0]}`).set('authorization', `Bearer ${u2token}`);

        expect(resp.status).toEqual(200);
        expect(resp.body).toEqual({message: "User deleted"});
    })

    test('throws error with incorrect invalid user id', async () => {
        const resp = await request(app).delete(`/users/9999`).set('authorization', `Bearer ${u1token}`);

        expect(resp.status).toEqual(200);
        expect(resp.body).toEqual({error: {message: "Unauthorized"}});
    })
    test('throws error with incorrect invalid user id', async () => {
        const resp = await request(app).delete(`/users/9999`).set('authorization', `Bearer ${u1token}`);
    
            expect(resp.status).toEqual(404);
            expect(resp.body).toEqual(NotFoundError);
        })
   
})