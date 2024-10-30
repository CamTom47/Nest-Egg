"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const globals_1 = require("@jest/globals");
const ExpressError_1 = require("../../../src/ExpressError");
const category_1 = tslib_1.__importDefault(require("./category"));
const testCommon_1 = require("../../testCommon");
(0, globals_1.afterAll)(testCommon_1.commonAfterAll);
(0, globals_1.afterEach)(testCommon_1.commonAfterEach);
(0, globals_1.beforeAll)(testCommon_1.commonBeforeAll);
(0, globals_1.beforeEach)(testCommon_1.commonBeforeEach);
(0, globals_1.describe)('findAll', function () {
    (0, globals_1.test)('works for system default categories', async function () {
        let categories = await category_1.default.findAll();
        (0, globals_1.expect)(categories).toEqual([
            { id: globals_1.expect.any(Number), name: 'testCategory', description: 'test description 1' },
            { id: globals_1.expect.any(Number), name: 'testCategory2', description: 'test description 2' },
        ]);
    });
    (0, globals_1.test)('works for finding by userId', async function () {
        let categories = await category_1.default.findAll(testCommon_1.testUserIds[1]);
        (0, globals_1.expect)(categories).toEqual([
            { id: globals_1.expect.any(Number), name: 'testCategory', description: 'test description 1' },
            { id: globals_1.expect.any(Number), name: 'testCategory2', description: 'test description 2' },
            { id: globals_1.expect.any(Number), name: 'testCategory3', description: 'test description 3' },
        ]);
    });
    (0, globals_1.test)('fails for invalid userId parameter and only returns default categories', async function () {
        let categories = await category_1.default.findAll(testCommon_1.testUserIds[99]);
        (0, globals_1.expect)(categories).toEqual([
            { id: globals_1.expect.any(Number), name: 'testCategory', description: 'test description 1' },
            { id: globals_1.expect.any(Number), name: 'testCategory2', description: 'test description 2' },
        ]);
    });
});
(0, globals_1.describe)('findById', function () {
    (0, globals_1.test)('works', async function () {
        let category = await category_1.default.findById(testCommon_1.testCategoryIds[0]);
        (0, globals_1.expect)(category).toEqual({ id: globals_1.expect.any(Number), name: 'testCategory', description: 'test description 1' });
    });
    (0, globals_1.test)('NotFoundError when invalid category_id', async function () {
        let category = await category_1.default.findById(testCommon_1.testCategoryIds[99]);
        (0, globals_1.expect)(category).toEqual(ExpressError_1.NotFoundError);
    });
});
(0, globals_1.describe)('create', () => {
    (0, globals_1.test)('works', async function () {
        let data = {
            user_id: testCommon_1.testUserIds[0],
            name: 'newCat',
            description: 'newCat description',
            system_default: false,
        };
        let newCategory = await category_1.default.create(data);
        (0, globals_1.expect)(newCategory).toEqual({
            id: globals_1.expect.any(Number),
            name: 'newCat',
            description: 'newCat description',
        });
    });
});
(0, globals_1.describe)('update', () => {
    (0, globals_1.test)('works', async () => {
        let data = {
            name: 'updateCat',
        };
        let updatedCategory = await category_1.default.update(testCommon_1.testCategoryIds[0], data);
        (0, globals_1.expect)(updatedCategory).toEqual({
            id: globals_1.expect.any(Number),
            name: 'updateCat',
            description: 'test description 1',
        });
    });
    (0, globals_1.test)('throws error with invalid category id', async () => {
        let data = {
            name: 'updateCat',
        };
        await category_1.default.update(testCommon_1.testCategoryIds[9], data);
        (0, globals_1.expect)(ExpressError_1.NotFoundError);
    });
});
(0, globals_1.describe)('delete', () => {
    (0, globals_1.test)('works', async () => {
        let response = await category_1.default.delete(testCommon_1.testCategoryIds[0]);
        (0, globals_1.expect)(response.message).toEqual('Category Deleted');
    });
    (0, globals_1.test)('throws errow with invalid category id', async () => {
        await category_1.default.delete(testCommon_1.testCategoryIds[99]);
        (0, globals_1.expect)(ExpressError_1.NotFoundError);
    });
});
//# sourceMappingURL=category.test.js.map