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
  testContributorIds,
  testBudgetIds,
  testAllocationIds
} from '../../testCommon';

afterAll(commonAfterAll);
afterEach(commonAfterEach);
beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);

describe('findAll', function () {
  test('works for all contributors', async function () {
    let contributors = await Contributor.findAll();
    expect(contributors).toEqual([
      { id: expect.any(Number), userId: testUserIds[0], name: "testContributor1"},
      { id: expect.any(Number), userId: testUserIds[1], name: "testContributor2"},
      { id: expect.any(Number), userId: testUserIds[1], name: "testContributor3"},
    ]);
  });

  test('works for finding by userId', async function () {
    let contributors = await Contributor.findAll(testUserIds[1]);
    expect(contributors).toEqual([
      { id: expect.any(Number), userId: testUserIds[1], name: "testContributor2"},
      { id: expect.any(Number), userId: testUserIds[1], name: "testContributor3"}
    ]);
  });
});

describe('findById', function () {
  test('works', async function () {
    let contributor = await Contributor.findById(testContributorIds[0]);
    expect(contributor).toEqual({ id: expect.any(Number), userId: testUserIds[0], name: "testContributor1"});
  });

  test('NotFoundError when invalid contributor_id', async function () {
    let contributor = await Contributor.findById(testContributorIds[99]);
    expect(NotFoundError);
  });
});

interface NewContributorData {
  user_id: number;
  name: string;
  budget_id: number;
  allocation_id: number;
}

describe('create', () => {
  test('works', async function () {
    let data: NewContributorData = {
      user_id: testUserIds[0],
      name: 'newContributor',
      budget_id: testBudgetIds[0],
      allocation_id: testAllocationIds[0],
    };

    let newContributor = await Contributor.create(data);
    expect(newContributor).toEqual({
      id: expect.any(Number),
      name: 'newContributor',
      userId: testUserIds[0]
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

    let updateContributor = await Contributor.update(testContributorIds[0], data);
    expect(updateContributor).toEqual({
      id: expect.any(Number),
      name: 'updateContributor',
      userId: testUserIds[0]
    });
  });

  test('throws error with invalid contributor id', async () => {
    let data = {
      name: 'updateContributor',
    };

    await Contributor.update(testContributorIds[9], data);
    expect(NotFoundError);
  });
});

describe('delete', () => {
  test('works', async () => {
    let response: { message?: string } = await Contributor.delete(testContributorIds[0]);
    expect(response.message).toEqual('Contributor Deleted');
  });

  test('throws errow with invalid contributor id', async () => {
    await Contributor.delete(testContributorIds[99]);
    expect(NotFoundError);
  });
});
