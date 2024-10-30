"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const globals_1 = require("@jest/globals");
const supertest_1 = tslib_1.__importDefault(require("supertest"));
const index_1 = tslib_1.__importDefault(require("../../index"));
const testCommon_1 = require("../../testCommon");
(0, globals_1.beforeAll)(testCommon_1.commonBeforeAll);
(0, globals_1.beforeEach)(testCommon_1.commonBeforeEach);
(0, globals_1.afterEach)(testCommon_1.commonAfterEach);
(0, globals_1.afterAll)(testCommon_1.commonAfterAll);
(0, globals_1.describe)('GET /', () => {
    (0, globals_1.test)('works', async () => {
        const resp = await (0, supertest_1.default)(index_1.default).get("/categories").set("authorization", `Bearer ${testCommon_1.u1token}`);
        (0, globals_1.expect)(resp.body).toEqual({
            categories: [
                { id: globals_1.expect.any(Number), name: 'testCategory', description: 'test description 1' },
                { id: globals_1.expect.any(Number), name: 'testCategory2', description: 'test description 2' },
                { id: globals_1.expect.any(Number), name: 'testCategory3', description: 'test description 3' },
            ],
        });
        (0, globals_1.expect)(resp.body.length).toEqual(3);
        (0, globals_1.expect)(resp.statusCode).toEqual(200);
    });
});
//# sourceMappingURL=categories.test.js.map