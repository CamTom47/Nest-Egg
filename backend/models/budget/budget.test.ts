import { describe, test, expect, afterAll, afterEach, beforeAll, beforeEach } from '@jest/globals';
import { BadRequestError, NotFoundError } from '../../src/ExpressError';
import { commonAfterAll, commonBeforeAll, commonAfterEach, commonBeforeEach, testBudgetIds } from '../testCommon';
import Budget from './budget';
import moment from 'moment';

afterAll(commonAfterAll);
beforeAll(commonBeforeAll);
afterEach(commonAfterEach);
beforeEach(commonBeforeEach);

describe('Find all budgets', () => {
  test('works', async () => {
    const budgets = await Budget.findAll();
    expect(budgets).toEqual([
      { id: expect.any(Number), name: 'TestBudget1', description: 'test1', date_created: expect.any(Date) },
      { id: expect.any(Number), name: 'TestBudget2', description: 'test2', date_created: expect.any(Date) },
    ]);
  });
});
describe('Find a budget by ID', () => {
  test('works', async () => {
    const budget = await Budget.findById(testBudgetIds[0]);
    expect(budget).toEqual({
      id: expect.any(Number),
      name: 'TestBudget1',
      description: 'test1',
      date_created: expect.any(Date),
    });
  });
  test('throws error on invalid ID', async () => {
    const budget = await Budget.findById(99999);
    expect(budget).toEqual(NotFoundError);
  });
});
describe('Create a new Budget', () => {
  const data = { name: 'TestBudgetNew', description: 'testNew', date_created: new Date().toISOString() };
  test('works', async () => {
    const budget = await Budget.create(data);
    expect(budget).toEqual({
      id: expect.any(Number),
      name: 'TestBudgetNew',
      description: 'testNew',
      date_created: expect.any(Date),
    });
  });
});

describe('Update an existing budgets information', () => {
  test('works with no password', async () => {
    const data = {
      name: 'budgetUpdate',
    };

    const budget = await Budget.update(testBudgetIds[0], data);
    expect(budget).toEqual({
      id: expect.any(Number),
      name: 'budgetUpdate',
      description: 'test1',
      date_created: expect.any(Date),
    });
  });
  test('throws error with incorrect budget ID', async () => {
    await Budget.update(9999, { name: 'firstUpdate' });
    expect(NotFoundError);
  });
});
describe('delete', () => {
  test('works', async () => {
    let response: { message?: string } = await Budget.delete(testBudgetIds[0]);
    expect(response.message).toEqual('Budget deleted');
  });
  test('throws errow with invalid budget id', async () => {
    await Budget.delete(testBudgetIds[99]);
    expect(BadRequestError);
  });
  test('throws errow with missing id', async () => {
    await Budget.delete();
    expect(NotFoundError);
  });
});
