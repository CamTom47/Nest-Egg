"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const globals_1 = require("@jest/globals");
const mapper_1 = tslib_1.__importDefault(require("./mapper"));
(0, globals_1.describe)('mapper helper function', () => {
    (0, globals_1.test)('works with categories', () => {
        let data = {
            name: 'test name',
            description: 'test description',
            userId: 1,
            systemDefault: false
        };
        const mappedData = (0, mapper_1.default)(data, 'category');
        (0, globals_1.expect)(mappedData).toEqual({
            name: 'test name',
            description: 'test description',
            user_id: 1,
            system_default: false
        });
    });
});
//# sourceMappingURL=mapper.test.js.map