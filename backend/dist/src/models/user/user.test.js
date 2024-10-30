"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const globals_1 = require("@jest/globals");
const ExpressError_1 = require("../../../src/ExpressError");
const testCommon_1 = require("../../testCommon");
const user_1 = tslib_1.__importDefault(require("./user"));
(0, globals_1.afterAll)(testCommon_1.commonAfterAll);
(0, globals_1.beforeAll)(testCommon_1.commonBeforeAll);
(0, globals_1.afterEach)(testCommon_1.commonAfterEach);
(0, globals_1.beforeEach)(testCommon_1.commonBeforeEach);
(0, globals_1.describe)('Find all users', () => {
    (0, globals_1.test)('works', async () => {
        const users = await user_1.default.findAll();
        (0, globals_1.expect)(users).toEqual([
            {
                id: globals_1.expect.any(Number),
                firstName: 'testF',
                lastName: 'testL',
                username: 'testUser',
                email: 'test@test.com',
                isAdmin: true,
            },
            {
                id: globals_1.expect.any(Number),
                firstName: 'testF2',
                lastName: 'testL2',
                username: 'testUser2',
                email: 'test@test.com',
                isAdmin: true,
            },
        ]);
    });
});
(0, globals_1.describe)('Find a user by ID', () => {
    (0, globals_1.test)('works', async () => {
        const user = await user_1.default.findById(testCommon_1.testUserIds[0]);
        (0, globals_1.expect)(user).toEqual({
            id: testCommon_1.testUserIds[0],
            firstName: 'testF',
            lastName: 'testL',
            username: 'testUser',
            email: 'test@test.com',
            isAdmin: true,
        });
    });
    (0, globals_1.test)('throws error on invalid ID', async () => {
        const user = await user_1.default.findById(99999);
        (0, globals_1.expect)(user).toEqual(ExpressError_1.NotFoundError);
    });
});
(0, globals_1.describe)('Create a new User', () => {
    const data = {
        first_name: 'newTestF',
        last_name: 'newTestL',
        username: 'newUser',
        password: 'testPassword',
        email: 'new@test.com',
        is_admin: false,
    };
    (0, globals_1.test)('works', async () => {
        const user = await user_1.default.register(data);
        (0, globals_1.expect)(user).toEqual({
            id: globals_1.expect.any(Number),
            firstName: 'newTestF',
            lastName: 'newTestL',
            username: 'newUser',
            email: 'new@test.com',
            isAdmin: false,
        });
    });
});
(0, globals_1.describe)('Update an existing users information', () => {
    (0, globals_1.test)('works with no password', async () => {
        const data = {
            first_name: 'firstUpdate',
            username: 'updateUser',
        };
        const user = await user_1.default.update(testCommon_1.testUserIds[0], data);
        (0, globals_1.expect)(user).toEqual({
            id: globals_1.expect.any(Number),
            firstName: 'firstUpdate',
            lastName: 'testL',
            password: globals_1.expect.any(String),
            username: 'updateUser',
            email: 'test@test.com',
            isAdmin: true,
        });
    });
    (0, globals_1.test)('works with password', async () => {
        const data = {
            password: 'updatepassword',
        };
        const user = await user_1.default.update(testCommon_1.testUserIds[0], data);
        (0, globals_1.expect)(user).toEqual({
            id: globals_1.expect.any(Number),
            firstName: 'testF',
            password: globals_1.expect.any(String),
            lastName: 'testL',
            username: 'testUser',
            email: 'test@test.com',
            isAdmin: true,
        });
    });
    (0, globals_1.test)('throws error with incorrect user ID', async () => {
        await user_1.default.update(9999, { first_name: 'firstUpdate' });
        (0, globals_1.expect)(ExpressError_1.NotFoundError);
    });
});
(0, globals_1.describe)('delete', () => {
    (0, globals_1.test)('works', async () => {
        let response = await user_1.default.delete(testCommon_1.testUserIds[0]);
        (0, globals_1.expect)(response.message).toEqual('User deleted');
    });
    (0, globals_1.test)('throws errow with invalid user id', async () => {
        await user_1.default.delete(testCommon_1.testUserIds[99]);
        (0, globals_1.expect)(ExpressError_1.NotFoundError);
    });
    (0, globals_1.test)('throws errow with missing id', async () => {
        await user_1.default.delete();
        (0, globals_1.expect)(ExpressError_1.BadRequestError);
    });
});
(0, globals_1.describe)('authenticate', () => {
    (0, globals_1.test)('works', async () => {
        const user = await user_1.default.authenticate("testUser", "testPassword");
        (0, globals_1.expect)(user).toEqual({
            id: globals_1.expect.any(Number),
            firstName: "testF",
            lastName: "testL",
            email: "test@test.com",
            isAdmin: true,
            username: "testUser"
        });
    });
    (0, globals_1.test)('throw error for incorrect username/pass', async () => {
        const user = await user_1.default.authenticate('testuer', 'testPassword');
        (0, globals_1.expect)(ExpressError_1.BadRequestError);
    });
});
//# sourceMappingURL=user.test.js.map