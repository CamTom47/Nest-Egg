"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const globals_1 = require("@jest/globals");
const ExpressError_1 = require("../../../src/ExpressError");
const subcategory_1 = tslib_1.__importDefault(require("./subcategory"));
const testCommon_1 = require("../../testCommon");
(0, globals_1.afterAll)(testCommon_1.commonAfterAll);
(0, globals_1.afterEach)(testCommon_1.commonAfterEach);
(0, globals_1.beforeAll)(testCommon_1.commonBeforeAll);
(0, globals_1.beforeEach)(testCommon_1.commonBeforeEach);
(0, globals_1.describe)('findAll', function () {
    (0, globals_1.test)('works for system default subcategories', async function () {
        let subcategories = await subcategory_1.default.findAll();
        (0, globals_1.expect)(subcategories).toEqual([
            {
                id: globals_1.expect.any(Number),
                name: 'testSubcategory',
                description: 'test description 1',
                categoryId: testCommon_1.testCategoryIds[0],
                userId: testCommon_1.testUserIds[0],
            },
            {
                id: globals_1.expect.any(Number),
                name: 'testSubcategory2',
                description: 'test description 2',
                categoryId: testCommon_1.testCategoryIds[0],
                userId: testCommon_1.testUserIds[0],
            },
        ]);
    });
    (0, globals_1.test)('works for finding by userId', async function () {
        let subcategories = await subcategory_1.default.findAll(testCommon_1.testUserIds[1]);
        (0, globals_1.expect)(subcategories).toEqual([
            {
                id: globals_1.expect.any(Number),
                name: 'testSubcategory',
                description: 'test description 1',
                categoryId: testCommon_1.testCategoryIds[0],
                userId: testCommon_1.testUserIds[0],
            },
            {
                id: globals_1.expect.any(Number),
                name: 'testSubcategory2',
                description: 'test description 2',
                categoryId: testCommon_1.testCategoryIds[0],
                userId: testCommon_1.testUserIds[0],
            },
            {
                id: globals_1.expect.any(Number),
                name: 'testSubcategory3',
                description: 'test description 3',
                categoryId: testCommon_1.testCategoryIds[1],
                userId: testCommon_1.testUserIds[1],
            },
        ]);
    });
    (0, globals_1.test)('fails for invalid userId parameter and only returns default subcategories', async function () {
        let subcategories = await subcategory_1.default.findAll(testCommon_1.testUserIds[99]);
        (0, globals_1.expect)(subcategories).toEqual([
            {
                id: globals_1.expect.any(Number),
                name: 'testSubcategory',
                description: 'test description 1',
                categoryId: testCommon_1.testCategoryIds[0],
                userId: testCommon_1.testUserIds[0],
            },
            {
                id: globals_1.expect.any(Number),
                name: 'testSubcategory2',
                description: 'test description 2',
                categoryId: testCommon_1.testCategoryIds[0],
                userId: testCommon_1.testUserIds[0],
            },
        ]);
    });
});
(0, globals_1.describe)('findById', function () {
    (0, globals_1.test)('works', async function () {
        let subcategory = await subcategory_1.default.findById(testCommon_1.testSubcategoryIds[0]);
        (0, globals_1.expect)(subcategory).toEqual({
            id: globals_1.expect.any(Number),
            name: 'testSubcategory',
            description: 'test description 1',
            categoryId: testCommon_1.testCategoryIds[0],
            userId: testCommon_1.testUserIds[0],
        });
    });
    (0, globals_1.test)('NotFoundError when invalid subcategory_id', async function () {
        let subcategory = await subcategory_1.default.findById(testCommon_1.testSubcategoryIds[99]);
        (0, globals_1.expect)(subcategory).toEqual(ExpressError_1.NotFoundError);
    });
});
(0, globals_1.describe)('create', () => {
    (0, globals_1.test)('works', async function () {
        let data = {
            name: 'newSubcat',
            description: 'newSubcat description',
            category_id: testCommon_1.testCategoryIds[0],
            user_id: testCommon_1.testUserIds[0],
            systemDefault: false,
        };
        let newSubcategory = await subcategory_1.default.create(data);
        (0, globals_1.expect)(newSubcategory).toEqual({
            id: globals_1.expect.any(Number),
            name: 'newSubcat',
            description: 'newSubcat description',
            categoryId: testCommon_1.testCategoryIds[0],
            userId: testCommon_1.testUserIds[0],
        });
    });
});
(0, globals_1.describe)('update', () => {
    (0, globals_1.test)('works', async () => {
        let data = {
            name: 'updateSubcat',
            description: "update description",
            category_id: testCommon_1.testCategoryIds[1]
        };
        let updatedSubcategory = await subcategory_1.default.update(testCommon_1.testSubcategoryIds[0], data);
        (0, globals_1.expect)(updatedSubcategory).toEqual({
            id: globals_1.expect.any(Number),
            name: 'updateSubcat',
            description: 'update description',
            categoryId: testCommon_1.testCategoryIds[1],
            userId: testCommon_1.testUserIds[0]
        });
    });
    (0, globals_1.test)('throws error with invalid subcategory id', async () => {
        let data = {
            name: 'updateSubcat',
        };
        await subcategory_1.default.update(testCommon_1.testSubcategoryIds[9], data);
        (0, globals_1.expect)(ExpressError_1.NotFoundError);
    });
});
(0, globals_1.describe)('delete', () => {
    (0, globals_1.test)('works', async () => {
        let response = await subcategory_1.default.delete(testCommon_1.testSubcategoryIds[0]);
        (0, globals_1.expect)(response.message).toEqual('Subcategory Deleted');
    });
    (0, globals_1.test)('throws errow with invalid subcategory id', async () => {
        await subcategory_1.default.delete(testCommon_1.testSubcategoryIds[99]);
        (0, globals_1.expect)(ExpressError_1.NotFoundError);
    });
});
//# sourceMappingURL=subcategory.test.js.map