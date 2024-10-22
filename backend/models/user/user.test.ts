import { describe, test, expect, afterAll, afterEach, beforeAll, beforeEach } from '@jest/globals';
import { BadRequestError, NotFoundError } from '../../src/ExpressError';
import { commonAfterAll, commonBeforeAll, commonAfterEach, commonBeforeEach, testUserIds } from '../testCommon';
import User from './user';
import exp from 'constants';

afterAll(commonAfterAll);
beforeAll(commonBeforeAll);
afterEach(commonAfterEach);
beforeEach(commonBeforeEach);

describe('Find all users', () => {
  test('works', async () => {
    const users = await User.findAll();
    expect(users).toEqual([
      {
        id: expect.any(Number),
        firstName: 'testF',
        lastName: 'testL',
        username: 'testUser',
        email: 'test@test.com',
        isAdmin: true,
      },
      {
        id: expect.any(Number),
        firstName: 'testF2',
        lastName: 'testL2',
        username: 'testUser2',
        email: 'test@test.com',
        isAdmin: true,
      },
    ]);
  });
});
describe('Find a user by ID', () => {
  test('works', async () => {
    const user = await User.findById(testUserIds[0]);
    expect(user).toEqual({
      id: testUserIds[0],
      firstName: 'testF',
      lastName: 'testL',
      username: 'testUser',
      email: 'test@test.com',
      isAdmin: true,
    });
  });
  test('throws error on invalid ID', async () => {
    const user = await User.findById(99999);
    expect(user).toEqual(NotFoundError);
  });
});
describe('Create a new User', () => {
  const data = {
    first_name: 'newTestF',
    last_name: 'newTestL',
    username: 'newUser',
    password: 'testPassword',
    email: 'new@test.com',
    is_admin: false,
  };
  test('works', async () => {
    const user = await User.register(data);
    expect(user).toEqual({
      id: expect.any(Number),
      firstName: 'newTestF',
      lastName: 'newTestL',
      username: 'newUser',
      email: 'new@test.com',
      isAdmin: false,
    });
  });
});

describe('Update an existing users information', () => {
  test('works with no password', async () => {
    const data = {
      first_name: 'firstUpdate',
      username: 'updateUser',
    };

    const user = await User.update(testUserIds[0], data);
    expect(user).toEqual({
      id: expect.any(Number),
      firstName: 'firstUpdate',
      lastName: 'testL',
      password: expect.any(String),
      username: 'updateUser',
      email: 'test@test.com',
      isAdmin: true,
    });
  });
  test('works with password', async () => {
    const data = {
      password: 'updatepassword',
    };

    const user = await User.update(testUserIds[0], data);
    expect(user).toEqual({
      id: expect.any(Number),
      firstName: 'testF',
      password: expect.any(String),
      lastName: 'testL',
      username: 'testUser',
      email: 'test@test.com',
      isAdmin: true,
    });
  });
  test('throws error with incorrect user ID', async () => {
    await User.update(9999, { first_name: 'firstUpdate' });
    expect(NotFoundError);
  });
});
describe('delete', () => {
  test('works', async () => {
    let response: { message?: string } = await User.delete(testUserIds[0]);
    expect(response.message).toEqual('User deleted');
  });
  test('throws errow with invalid user id', async () => {
    await User.delete(testUserIds[99]);
    expect(NotFoundError);
  });
  test('throws errow with missing id', async () => {
    await User.delete();
    expect(BadRequestError);
  });
});
describe('authenticate', () => {
  test('works', async () => {
    const user = await User.authenticate("testUser", "testPassword")
    expect(user).toEqual({
      id: expect.any(Number),
      firstName: "testF",
      lastName: "testL",
      email: "test@test.com",
      isAdmin: true,
      username: "testUser"
    })
  })
  test('throw error for incorrect username/pass', async () => {
    const user = await User.authenticate('testuer', 'testPassword');
    expect(BadRequestError)
  })
})
