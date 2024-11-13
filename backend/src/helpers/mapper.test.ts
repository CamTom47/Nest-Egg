import { describe, test, expect, beforeAll, beforeEach, afterAll, afterEach } from "@jest/globals";
import mapper from "./mapper";

describe('mapper helper function', () => {
  test('works with categories', () => {
    let data = {
        name: 'test name',
        description: 'test description',
        userId: 1,
        systemDefault: false
    }

    const mappedData = mapper(data, 'category');

    expect(mappedData).toEqual({
        name: 'test name',
        description: 'test description',
        user_id: 1,
        system_default: false
    })
  })

  test('works with subcategories', () => {
    let data = {
        name: 'test name',
        description: 'test description',
        userId: 1,
        categoryId: 1,
        systemDefault: false
    }

    const mappedData = mapper(data, 'subcategory');

    expect(mappedData).toEqual({
        name: 'test name',
        description: 'test description',
        user_id: 1,
        category_id: 1,
        system_default: false
    })
  })

  test('works with users', () => {
    let data = {
        username: 'testUser',
        password: 'password'
    }

    const mappedData = mapper(data, 'user');

    expect(mappedData).toEqual({
        username: 'testUser',
        password: 'password',
    })
  })
})
