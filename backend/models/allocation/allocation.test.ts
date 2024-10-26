import { describe, test, expect, afterAll, afterEach, beforeAll, beforeEach } from '@jest/globals';
import { BadRequestError, NotFoundError } from '../../src/ExpressError';
import {
  commonAfterAll,
  commonBeforeAll,
  commonAfterEach,
  commonBeforeEach,
  testBudgetIds,
  testSubcategoryIds,
  testAllocationIds,
} from '../testCommon';
import Allocation from './allocation';

afterAll(commonAfterAll);
beforeAll(commonBeforeAll);
afterEach(commonAfterEach);
beforeEach(commonBeforeEach);

describe('Find all allocations', () => {
  test('works', async () => {
    const allocations = await Allocation.findAll();
    expect(allocations).toEqual([
      { id: expect.any(Number), amount: "$200.00", subcategoryId: testSubcategoryIds[0], budgetId: testBudgetIds[0] },
      { id: expect.any(Number), amount: "$500.00", subcategoryId: testSubcategoryIds[1], budgetId: testBudgetIds[1] },
      { id: expect.any(Number), amount: "$770.00", subcategoryId: testSubcategoryIds[1], budgetId: testBudgetIds[1] },
    ]);
  });
});
describe('Find all allocations by budget_id', () => {
    test('works', async () => {
    const allocations = await Allocation.findAll(testBudgetIds[1]);
    expect(allocations).toEqual([
      { id: expect.any(Number), amount: "$500.00", subcategoryId: testSubcategoryIds[1], budgetId: testBudgetIds[1] },
      { id: expect.any(Number), amount: "$770.00", subcategoryId: testSubcategoryIds[1], budgetId: testBudgetIds[1] },
    ]);
  });
});
describe('Find a allocation by ID', () => {
  test('works', async () => {
    const allocation = await Allocation.findById(testAllocationIds[0]);
    expect(allocation).toEqual({
      id: expect.any(Number),
      amount: "$200.00",
      subcategoryId: testSubcategoryIds[0],
      budgetId: testBudgetIds[0],
    });
  });
  test('throws error on invalid ID', async () => {
    const allocation = await Allocation.findById(99999);
    expect(allocation).toEqual(NotFoundError);
  });
});

interface NewAllocation {
    amount: number;
    subcategory_id: number;
    budget_id: number;
  }
describe('Create a new Allocation', () => {
  test('works', async () => {
    const data: NewAllocation = {
        amount: 702.09,
        subcategory_id: testSubcategoryIds[0],
        budget_id: testBudgetIds[0]
      };
    const allocation = await Allocation.create(data);
    expect(allocation).toEqual({
      id: expect.any(Number),
      amount: "$702.09",
      subcategoryId: testSubcategoryIds[0],
      budgetId: testBudgetIds[0],
    });
  });
});


interface UpdateAllocation {
    amount?: number;
    subcategory_id?: number;
    budget_id?: number;
  }

describe('Update an existing allocations information', () => {
  test('works with no password', async () => {
    const data: UpdateAllocation = {
      amount: 39.00,
    };

    const allocation = await Allocation.update(testAllocationIds[0], data);
    expect(allocation).toEqual({
      id: expect.any(Number),
      amount: "$39.00",
      subcategoryId: testSubcategoryIds[0],
      budgetId: testBudgetIds[0],
    });
  });
  test('throws error with incorrect allocation ID', async () => {
    await Allocation.update(9999, { amount: 300 });
    expect(NotFoundError);
  });
});
describe('delete', () => {
  test('works', async () => {
    let response: { message?: string } = await Allocation.delete(testAllocationIds[0]);
    expect(response.message).toEqual('Allocation deleted');
  });
  test('throws errow with invalid allocation id', async () => {
    await Allocation.delete(testBudgetIds[99]);
    expect(BadRequestError);
  });
  test('throws errow with missing id', async () => {
    await Allocation.delete();
    expect(NotFoundError);
  });
});
