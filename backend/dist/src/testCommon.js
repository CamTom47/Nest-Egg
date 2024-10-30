"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.u2token = exports.u1token = exports.testAllocationIds = exports.testBudgetIds = exports.testUserIds = exports.testSubcategoryIds = exports.testCategoryIds = void 0;
exports.commonBeforeAll = commonBeforeAll;
exports.commonAfterAll = commonAfterAll;
exports.commonBeforeEach = commonBeforeEach;
exports.commonAfterEach = commonAfterEach;
const tslib_1 = require("tslib");
const db_1 = tslib_1.__importDefault(require("../db"));
process.env.NODE_ENV = 'test';
const token_1 = tslib_1.__importDefault(require("./helpers/token"));
let testUserIds = [];
exports.testUserIds = testUserIds;
let testCategoryIds = [];
exports.testCategoryIds = testCategoryIds;
let testSubcategoryIds = [];
exports.testSubcategoryIds = testSubcategoryIds;
let testBudgetIds = [];
exports.testBudgetIds = testBudgetIds;
let testAllocationIds = [];
exports.testAllocationIds = testAllocationIds;
async function commonBeforeAll() {
    await db_1.default.query('DELETE FROM categories');
    await db_1.default.query('DELETE FROM users');
    await db_1.default.query('DELETE FROM budgets');
    await db_1.default.query('DELETE FROM subcategories');
    await db_1.default.query('DELETE FROM allocations');
    const resultUser = await db_1.default.query(`
        INSERT INTO users(first_name, last_name, username, email, password, is_admin)
        VALUES ( 'testF', 'testL', 'testUser', 'test@test.com', '$2a$04$swlC6Fmltw2.BQtiVe86k.WA53OBhcBs9o5iaTDhg3WJ4mz6Fq0pu', true),
              ( 'testF2', 'testL2', 'testUser2', 'test@test.com', '$2a$04$swlC6Fmltw2.BQtiVe86k.WA53OBhcBs9o5iaTDhg3WJ4mz6Fq0pu', true)
        RETURNING id`);
    testUserIds.splice(0, 0, ...resultUser.rows.map((u) => u.id));
    const resultCategory = await db_1.default.query(`
        INSERT INTO categories(user_id, name, description, system_default)
        VALUES ($2, 'testCategory', 'test description 1', true),
              ($1, 'testCategory2', 'test description 2', true),
              ($2, 'testCategory3', 'test description 3', false)
              RETURNING id`, [testUserIds[0], testUserIds[1]]);
    testCategoryIds.splice(0, 0, ...resultCategory.rows.map((c) => c.id));
    const resultSubcategory = await db_1.default.query(`
    INSERT INTO subcategories(name, description, category_id, user_id, system_default)
    VALUES ('testSubcategory', 'test description 1', $1, $3, true),
    ('testSubcategory2', 'test description 2', $1, $3, true),
    ('testSubcategory3', 'test description 3', $2, $4, false)
    RETURNING id`, [testCategoryIds[0], testCategoryIds[1], testUserIds[0], testUserIds[1]]);
    testSubcategoryIds.splice(0, 0, ...resultSubcategory.rows.map((s) => s.id));
    const resultBudgets = await db_1.default.query(`
    INSERT INTO budgets(name, description)
    VALUES('TestBudget1', 'test1'),
    ('TestBudget2', 'test2')
    RETURNING id`);
    testBudgetIds.splice(0, 0, ...resultBudgets.rows.map((b) => b.id));
    const resultAllocations = await db_1.default.query(`
    INSERT INTO allocations(amount, subcategory_id, budget_id)
    VALUES(200, ${testSubcategoryIds[0]}, ${testBudgetIds[0]}),
          (500, ${testSubcategoryIds[1]}, ${testBudgetIds[1]}),
          (770, ${testSubcategoryIds[1]}, ${testBudgetIds[1]})
    RETURNING id`);
    testAllocationIds.splice(0, 0, ...resultAllocations.rows.map((a) => a.id));
}
async function commonBeforeEach() {
    await db_1.default.query('BEGIN');
}
async function commonAfterEach() {
    await db_1.default.query('ROLLBACK');
}
async function commonAfterAll() {
    await db_1.default.end();
}
const u1token = (0, token_1.default)({ id: testUserIds[0], username: "testUser1", isAdmin: true });
exports.u1token = u1token;
const u2token = (0, token_1.default)({ id: testUserIds[1], username: "testUser2", isAdmin: false });
exports.u2token = u2token;
//# sourceMappingURL=testCommon.js.map