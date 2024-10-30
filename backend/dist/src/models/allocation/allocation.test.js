"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const globals_1 = require("@jest/globals");
const ExpressError_1 = require("../../../src/ExpressError");
const testCommon_1 = require("../../testCommon");
const allocation_1 = tslib_1.__importDefault(require("./allocation"));
(0, globals_1.afterAll)(testCommon_1.commonAfterAll);
(0, globals_1.beforeAll)(testCommon_1.commonBeforeAll);
(0, globals_1.afterEach)(testCommon_1.commonAfterEach);
(0, globals_1.beforeEach)(testCommon_1.commonBeforeEach);
(0, globals_1.describe)('Find all allocations', () => {
    (0, globals_1.test)('works', async () => {
        const allocations = await allocation_1.default.findAll();
        (0, globals_1.expect)(allocations).toEqual([
            { id: globals_1.expect.any(Number), amount: "$200.00", subcategoryId: testCommon_1.testSubcategoryIds[0], budgetId: testCommon_1.testBudgetIds[0] },
            { id: globals_1.expect.any(Number), amount: "$500.00", subcategoryId: testCommon_1.testSubcategoryIds[1], budgetId: testCommon_1.testBudgetIds[1] },
            { id: globals_1.expect.any(Number), amount: "$770.00", subcategoryId: testCommon_1.testSubcategoryIds[1], budgetId: testCommon_1.testBudgetIds[1] },
        ]);
    });
});
(0, globals_1.describe)('Find all allocations by budget_id', () => {
    (0, globals_1.test)('works', async () => {
        const allocations = await allocation_1.default.findAll(testCommon_1.testBudgetIds[1]);
        (0, globals_1.expect)(allocations).toEqual([
            { id: globals_1.expect.any(Number), amount: "$500.00", subcategoryId: testCommon_1.testSubcategoryIds[1], budgetId: testCommon_1.testBudgetIds[1] },
            { id: globals_1.expect.any(Number), amount: "$770.00", subcategoryId: testCommon_1.testSubcategoryIds[1], budgetId: testCommon_1.testBudgetIds[1] },
        ]);
    });
});
(0, globals_1.describe)('Find a allocation by ID', () => {
    (0, globals_1.test)('works', async () => {
        const allocation = await allocation_1.default.findById(testCommon_1.testAllocationIds[0]);
        (0, globals_1.expect)(allocation).toEqual({
            id: globals_1.expect.any(Number),
            amount: "$200.00",
            subcategoryId: testCommon_1.testSubcategoryIds[0],
            budgetId: testCommon_1.testBudgetIds[0],
        });
    });
    (0, globals_1.test)('throws error on invalid ID', async () => {
        const allocation = await allocation_1.default.findById(99999);
        (0, globals_1.expect)(allocation).toEqual(ExpressError_1.NotFoundError);
    });
});
(0, globals_1.describe)('Create a new Allocation', () => {
    (0, globals_1.test)('works', async () => {
        const data = {
            amount: 702.09,
            subcategory_id: testCommon_1.testSubcategoryIds[0],
            budget_id: testCommon_1.testBudgetIds[0]
        };
        const allocation = await allocation_1.default.create(data);
        (0, globals_1.expect)(allocation).toEqual({
            id: globals_1.expect.any(Number),
            amount: "$702.09",
            subcategoryId: testCommon_1.testSubcategoryIds[0],
            budgetId: testCommon_1.testBudgetIds[0],
        });
    });
});
(0, globals_1.describe)('Update an existing allocations information', () => {
    (0, globals_1.test)('works with no password', async () => {
        const data = {
            amount: 39.00,
        };
        const allocation = await allocation_1.default.update(testCommon_1.testAllocationIds[0], data);
        (0, globals_1.expect)(allocation).toEqual({
            id: globals_1.expect.any(Number),
            amount: "$39.00",
            subcategoryId: testCommon_1.testSubcategoryIds[0],
            budgetId: testCommon_1.testBudgetIds[0],
        });
    });
    (0, globals_1.test)('throws error with incorrect allocation ID', async () => {
        await allocation_1.default.update(9999, { amount: 300 });
        (0, globals_1.expect)(ExpressError_1.NotFoundError);
    });
});
(0, globals_1.describe)('delete', () => {
    (0, globals_1.test)('works', async () => {
        let response = await allocation_1.default.delete(testCommon_1.testAllocationIds[0]);
        (0, globals_1.expect)(response.message).toEqual('Allocation deleted');
    });
    (0, globals_1.test)('throws errow with invalid allocation id', async () => {
        await allocation_1.default.delete(testCommon_1.testBudgetIds[99]);
        (0, globals_1.expect)(ExpressError_1.BadRequestError);
    });
    (0, globals_1.test)('throws errow with missing id', async () => {
        await allocation_1.default.delete(undefined);
        (0, globals_1.expect)(ExpressError_1.NotFoundError);
    });
});
//# sourceMappingURL=allocation.test.js.map