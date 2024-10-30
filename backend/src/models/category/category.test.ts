import { describe, test, expect, afterAll, afterEach, beforeAll, beforeEach } from '@jest/globals';
import { BadRequestError, NotFoundError } from '../../../src/ExpressError';
import Category from './category';
import {
  commonAfterAll,
  commonBeforeAll,
  commonAfterEach,
  commonBeforeEach,
  testCategoryIds,
  testUserIds,
} from '../../testCommon';

afterAll(commonAfterAll);
afterEach(commonAfterEach);
beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);

describe('findAll', function () {
  test('works for system default categories', async function () {
    let categories = await Category.findAll();
    expect(categories).toEqual([
      { id: expect.any(Number), name: 'testCategory', description: 'test description 1' },
      { id: expect.any(Number), name: 'testCategory2', description: 'test description 2' },
    ]);
  });

  test('works for finding by userId', async function () {
    let categories = await Category.findAll(testUserIds[1]);
    expect(categories).toEqual([
      { id: expect.any(Number), name: 'testCategory', description: 'test description 1' },
      { id: expect.any(Number), name: 'testCategory2', description: 'test description 2' },
      { id: expect.any(Number), name: 'testCategory3', description: 'test description 3' },
    ]);
  });

  test('fails for invalid userId parameter and only returns default categories', async function () {
    let categories = await Category.findAll(testUserIds[99]);
    expect(categories).toEqual([
      { id: expect.any(Number), name: 'testCategory', description: 'test description 1' },
      { id: expect.any(Number), name: 'testCategory2', description: 'test description 2' },
    ]);
  });
});

describe('findById', function () {
  test('works', async function () {
    let category = await Category.findById(testCategoryIds[0]);
    expect(category).toEqual({ id: expect.any(Number), name: 'testCategory', description: 'test description 1' });
  });

  test('NotFoundError when invalid category_id', async function () {
    let category = await Category.findById(testCategoryIds[99]);
    expect(category).toEqual(NotFoundError);
  });
});

interface NewCategoryData {
  user_id: number;
  name: string;
  description: string;
  system_default: boolean;
}

describe('create', () => {
  test('works', async function () {
    let data: NewCategoryData = {
      user_id: testUserIds[0],
      name: 'newCat',
      description: 'newCat description',
      system_default: false,
    };

    let newCategory = await Category.create(data);
    expect(newCategory).toEqual({
      id: expect.any(Number),
      name: 'newCat',
      description: 'newCat description',
    });
  });
});

interface UpdateCategoryData {
  name?: string;
  description?: string;
  system_default?: boolean;
}

describe('update', () => {
  test('works', async () => {
    let data = {
      name: 'updateCat',
    };

    let updatedCategory = await Category.update(testCategoryIds[0], data);
    expect(updatedCategory).toEqual({
      id: expect.any(Number),
      name: 'updateCat',
      description: 'test description 1',
    });
  });

  test('throws error with invalid category id', async () => {
    let data = {
      name: 'updateCat',
    };

    await Category.update(testCategoryIds[9], data);
    expect(NotFoundError);
  });
});

describe('delete', () => {
  test('works', async () => {
    let response: { message?: string } = await Category.delete(testCategoryIds[0]);
    expect(response.message).toEqual('Category Deleted');
  });

  test('throws errow with invalid category id', async () => {
    await Category.delete(testCategoryIds[99]);
    expect(NotFoundError);
  });
});
