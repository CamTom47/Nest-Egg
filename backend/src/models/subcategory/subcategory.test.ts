import { describe, test, expect, afterAll, afterEach, beforeAll, beforeEach } from '@jest/globals';
import { BadRequestError, NotFoundError } from '../../../src/ExpressError';
import Subcategory from './subcategory';
import {
  commonAfterAll,
  commonBeforeAll,
  commonAfterEach,
  commonBeforeEach,
  testSubcategoryIds,
  testUserIds,
  testCategoryIds,
} from '../../testCommon';

afterAll(commonAfterAll);
afterEach(commonAfterEach);
beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);

describe('findAll', function () {
  test('works for system default subcategories', async function () {
    let subcategories = await Subcategory.findAll();
    expect(subcategories).toEqual([
      {
        id: expect.any(Number),
        name: 'testSubcategory',
        description: 'test description 1',
        categoryId: testCategoryIds[0],
        userId: testUserIds[0],
      },
      {
        id: expect.any(Number),
        name: 'testSubcategory2',
        description: 'test description 2',
        categoryId: testCategoryIds[0],
        userId: testUserIds[0],
      },
    ]);
  });

  test('works for finding by userId', async function () {
    let subcategories = await Subcategory.findAll(testUserIds[1]);
    expect(subcategories).toEqual([
      {
        id: expect.any(Number),
        name: 'testSubcategory',
        description: 'test description 1',
        categoryId: testCategoryIds[0],
        userId: testUserIds[0],
      },
      {
        id: expect.any(Number),
        name: 'testSubcategory2',
        description: 'test description 2',
        categoryId: testCategoryIds[0],
        userId: testUserIds[0],
      },
      {
        id: expect.any(Number),
        name: 'testSubcategory3',
        description: 'test description 3',
        categoryId: testCategoryIds[1],
        userId: testUserIds[1],
      },
    ]);
  });

  test('fails for invalid userId parameter and only returns default subcategories', async function () {
    let subcategories = await Subcategory.findAll(testUserIds[99]);
    expect(subcategories).toEqual([
      {
        id: expect.any(Number),
        name: 'testSubcategory',
        description: 'test description 1',
        categoryId: testCategoryIds[0],
        userId: testUserIds[0],
      },
      {
        id: expect.any(Number),
        name: 'testSubcategory2',
        description: 'test description 2',
        categoryId: testCategoryIds[0],
        userId: testUserIds[0],
      },
    ]);
  });
});

describe('findById', function () {
  test('works', async function () {
    let subcategory = await Subcategory.findById(testSubcategoryIds[0]);
    expect(subcategory).toEqual({
      id: expect.any(Number),
      name: 'testSubcategory',
      description: 'test description 1',
      categoryId: testCategoryIds[0],
      userId: testUserIds[0],
    });
  });

  test('NotFoundError when invalid subcategory_id', async function () {
    let subcategory = await Subcategory.findById(testSubcategoryIds[99]);
    expect(subcategory).toEqual(NotFoundError);
  });
});

interface NewSubcategoryData {
  name: string;
  description: string;
  category_id: number;
  user_id: number;
  systemDefault: boolean;
}

describe('create', () => {
  test('works', async function () {
    let data: NewSubcategoryData = {
      name: 'newSubcat',
      description: 'newSubcat description',
      category_id: testCategoryIds[0],
      user_id: testUserIds[0],
      systemDefault: false,
    };

    let newSubcategory = await Subcategory.create(data);
    expect(newSubcategory).toEqual({
      id: expect.any(Number),
      name: 'newSubcat',
      description: 'newSubcat description',
      categoryId: testCategoryIds[0],
      userId: testUserIds[0],
    });
  });
});

interface UpdateSubcategoryData {
  name?: string;
  description?: string;
  category_id?: number;
  user_id?: number;
  systemDefault?: boolean;
}

describe('update', () => {
  test('works', async () => {
    let data: UpdateSubcategoryData = {
      name: 'updateSubcat',
      description: "update description",
      category_id: testCategoryIds[1]
    };

    let updatedSubcategory = await Subcategory.update(testSubcategoryIds[0], data);
    expect(updatedSubcategory).toEqual({
      id: expect.any(Number),
      name: 'updateSubcat',
      description: 'update description',
      categoryId: testCategoryIds[1],
      userId: testUserIds[0]
    });
  });

  test('throws error with invalid subcategory id', async () => {
    let data = {
      name: 'updateSubcat',
    };

    await Subcategory.update(testSubcategoryIds[9], data);
    expect(NotFoundError);
  });
});

describe('delete', () => {
  test('works', async () => {
    let response: { message?: string } = await Subcategory.delete(testSubcategoryIds[0]);
    expect(response.message).toEqual('Subcategory Deleted');
  });

  test('throws errow with invalid subcategory id', async () => {
    await Subcategory.delete(testSubcategoryIds[99]);
    expect(NotFoundError);
  });
});
