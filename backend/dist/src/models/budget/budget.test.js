"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const globals_1 = require("@jest/globals");
const ExpressError_1 = require("../../../src/ExpressError");
const testCommon_1 = require("../../testCommon");
const budget_1 = tslib_1.__importDefault(require("./budget"));
(0, globals_1.afterAll)(testCommon_1.commonAfterAll);
(0, globals_1.beforeAll)(testCommon_1.commonBeforeAll);
(0, globals_1.afterEach)(testCommon_1.commonAfterEach);
(0, globals_1.beforeEach)(testCommon_1.commonBeforeEach);
(0, globals_1.describe)('Find all budgets', () => {
    (0, globals_1.test)('works', async () => {
        const budgets = await budget_1.default.findAll();
        (0, globals_1.expect)(budgets).toEqual([
            { id: globals_1.expect.any(Number), name: 'TestBudget1', description: 'test1', date_created: globals_1.expect.any(Date) },
            { id: globals_1.expect.any(Number), name: 'TestBudget2', description: 'test2', date_created: globals_1.expect.any(Date) },
        ]);
    });
});
(0, globals_1.describe)('Find a budget by ID', () => {
    (0, globals_1.test)('works', async () => {
        const budget = await budget_1.default.findById(testCommon_1.testBudgetIds[0]);
        (0, globals_1.expect)(budget).toEqual({
            id: globals_1.expect.any(Number),
            name: 'TestBudget1',
            description: 'test1',
            date_created: globals_1.expect.any(Date),
        });
    });
    (0, globals_1.test)('throws error on invalid ID', async () => {
        const budget = await budget_1.default.findById(99999);
        (0, globals_1.expect)(budget).toEqual(ExpressError_1.NotFoundError);
    });
});
(0, globals_1.describe)('Create a new Budget', () => {
    const data = { name: 'TestBudgetNew', description: 'testNew', date_created: new Date().toISOString() };
    (0, globals_1.test)('works', async () => {
        const budget = await budget_1.default.create(data);
        (0, globals_1.expect)(budget).toEqual({
            id: globals_1.expect.any(Number),
            name: 'TestBudgetNew',
            description: 'testNew',
            date_created: globals_1.expect.any(Date),
        });
    });
});
(0, globals_1.describe)('Update an existing budgets information', () => {
    (0, globals_1.test)('works with no password', async () => {
        const data = {
            name: 'budgetUpdate',
        };
        const budget = await budget_1.default.update(testCommon_1.testBudgetIds[0], data);
        (0, globals_1.expect)(budget).toEqual({
            id: globals_1.expect.any(Number),
            name: 'budgetUpdate',
            description: 'test1',
            date_created: globals_1.expect.any(Date),
        });
    });
    (0, globals_1.test)('throws error with incorrect budget ID', async () => {
        await budget_1.default.update(9999, { name: 'firstUpdate' });
        (0, globals_1.expect)(ExpressError_1.NotFoundError);
    });
});
(0, globals_1.describe)('delete', () => {
    (0, globals_1.test)('works', async () => {
        let response = await budget_1.default.delete(testCommon_1.testBudgetIds[0]);
        (0, globals_1.expect)(response.message).toEqual('Budget deleted');
    });
    (0, globals_1.test)('throws errow with invalid budget id', async () => {
        await budget_1.default.delete(testCommon_1.testBudgetIds[99]);
        (0, globals_1.expect)(ExpressError_1.BadRequestError);
    });
    (0, globals_1.test)('throws errow with missing id', async () => {
        await budget_1.default.delete();
        (0, globals_1.expect)(ExpressError_1.NotFoundError);
    });
});
//# sourceMappingURL=budget.test.js.map