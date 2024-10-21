"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const globals_1 = require("@jest/globals");
const supertest_1 = tslib_1.__importDefault(require("supertest"));
const app_1 = tslib_1.__importDefault(require("./app"));
const db_1 = tslib_1.__importDefault(require("../db"));
(0, globals_1.test)('not found 404', async function () {
    const resp = await (0, supertest_1.default)(app_1.default).get('/not-a-path');
    (0, globals_1.expect)(resp.statusCode).toEqual(404);
});
(0, globals_1.afterAll)(function () {
    db_1.default.end();
});
//# sourceMappingURL=app.test.js.map