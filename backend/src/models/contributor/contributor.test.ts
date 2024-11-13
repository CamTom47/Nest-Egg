import { describe, test, expect, afterAll, afterEach, beforeAll, beforeEach } from '@jest/globals';
import { BadRequestError, NotFoundError } from '../../ExpressError';
import Contributor from './contributor';
import {
  commonAfterAll,
  commonBeforeAll,
  commonAfterEach,
  commonBeforeEach,
  testCategoryIds,
  testUserIds,
  testContributorIds
} from '../../testCommon';

afterAll(commonAfterAll);
afterEach(commonAfterEach);
beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);

describe('findAll', function () {
  test('works for system default contributors', async function () {
    let contributors = await Contributor.findAll();
    expect(contributors).toEqual([
      { id: expect.any(Number), user_id: testContributorIds[0], name: "testContributor1"},
      { id: expect.any(Number), user_id: testContributorIds[1], name: "testContributor2"},
      { id: expect.any(Number), user_id: testContributorIds[1], name: "testContributor3"},
    ]);
  });

  test('works for finding by userId', async function () {
    let contributors = await Contributor.findAll(testUserIds[1]);
    expect(contributors).toEqual([
      { id: expect.any(Number), name: 'testCategory', description: 'test description 1' },
      { id: expect.any(Number), name: 'testCategory2', description: 'test description 2' },
      { id: expect.any(Number), name: 'testCategory3', description: 'test description 3' },
    ]);
  });

  test('fails for invalid userId parameter and only returns default contributors', async function () {
    let contributors = await Contributor.findAll(testUserIds[99]);
    expect(contributors).toEqual([
      { id: expect.any(Number), name: 'testCategory', description: 'test description 1' },
      { id: expect.any(Number), name: 'testCategory2', description: 'test description 2' },
    ]);
  });
});

describe('findById', function () {
  test('works', async function () {
    let contributor = await Contributor.findById(testCategoryIds[0]);
    expect(contributor).toEqual({ id: expect.any(Number), name: 'testCategory', description: 'test description 1' });
  });

  test('NotFoundError when invalid category_id', async function () {
    let contributor = await Contributor.findById(testCategoryIds[99]);
    expect(contributor).toEqual(NotFoundError);
  });
});

interface NewContributorData {
  user_id: number;
  name: string;
}

describe('create', () => {
  test('works', async function () {
    let data: NewContributorData = {
      user_id: testUserIds[0],
      name: 'newContributor'
    };

    let newContributor = await Contributor.create(data);
    expect(newContributor).toEqual({
      id: expect.any(Number),
      name: 'newContributor',
    });
  });
});

interface UpdateContributorData {
  name?: string;
}

describe('update', () => {
  test('works', async () => {
    let data: UpdateContributorData = {
      name: 'updateContributor',
    };

    let updateContributor = await Contributor.update(testCategoryIds[0], data);
    expect(updateContributor).toEqual({
      id: expect.any(Number),
      name: 'updateContributor'
    });
  });

  test('throws error with invalid contributor id', async () => {
    let data = {
      name: 'updateContributor',
    };

    await Contributor.update(testCategoryIds[9], data);
    expect(NotFoundError);
  });
});

describe('delete', () => {
  test('works', async () => {
    let response: { message?: string } = await Contributor.delete(testCategoryIds[0]);
    expect(response.message).toEqual('Contributor Deleted');
  });

  test('throws errow with invalid contributor id', async () => {
    await Contributor.delete(testCategoryIds[99]);
    expect(NotFoundError);
  });
});
