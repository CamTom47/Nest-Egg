import { timeStamp } from 'console';
import db from '../db.ts';
process.env.NODE_ENV = 'test';

let testUserIds: number[] = [];
let testCategoryIds: number[] = [];
let testSubcategoryIds: number[] = [];
let testBudgetIds: number[] = [];

async function commonBeforeAll() {
  await db.query('DELETE FROM categories');
  await db.query('DELETE FROM users');
  await db.query('DELETE FROM budgets');

  const resultUser = await db.query(`
        INSERT INTO users(first_name, last_name, username, email, password, is_admin)
        VALUES ( 'testF', 'testL', 'testUser', 'test@test.com', '$2a$04$swlC6Fmltw2.BQtiVe86k.WA53OBhcBs9o5iaTDhg3WJ4mz6Fq0pu', true),
        ( 'testF2', 'testL2', 'testUser2', 'test@test.com', '$2a$04$swlC6Fmltw2.BQtiVe86k.WA53OBhcBs9o5iaTDhg3WJ4mz6Fq0pu', true)
        RETURNING id`);

  testUserIds.splice(0, 0, ...resultUser.rows.map((u: { id: number }) => u.id));

  const resultCategory = await db.query(
    `
        INSERT INTO categories(user_id, name, description, systemDefault)
        VALUES ($1, 'testCategory', 'test description 1', true),
              ($1, 'testCategory2', 'test description 2', true),
              ($2, 'testCategory3', 'test description 3', false)
              RETURNING id`,
    [testUserIds[0], testUserIds[1]]
  );

  testCategoryIds.splice(0, 0, ...resultCategory.rows.map((c: { id: number }) => c.id));
  
  const resultSubcategory = await db.query(
    `
    INSERT INTO subcategories(name, description, category_id, user_id, systemDefault)
    VALUES ('testSubcategory', 'test description 1', $1, $3, true),
    ('testSubcategory2', 'test description 2', $1, $3, true),
    ('testSubcategory3', 'test description 3', $2, $4, false)
    RETURNING id`,
    [testCategoryIds[0], testCategoryIds[1], testUserIds[0], testUserIds[1]]
  );
  
  testSubcategoryIds.splice(0, 0, ...resultSubcategory.rows.map((s: { id: number }) => s.id));

  const resultBudgets = await db.query(`
    INSERT INTO budgets(name, description)
    VALUES('TestBudget1', 'test1'),
    ('TestBudget2', 'test2')
    RETURNING id`);

  testBudgetIds.splice(0, 0, ...resultBudgets.rows.map((b: { id: number }) => b.id));
}

async function commonBeforeEach() {
  await db.query('BEGIN');
}

async function commonAfterEach() {
  await db.query('ROLLBACK');
}

async function commonAfterAll() {
  await db.end();
}

export {
  commonBeforeAll,
  commonAfterAll,
  commonBeforeEach,
  commonAfterEach,
  testCategoryIds,
  testSubcategoryIds,
  testUserIds,
  testBudgetIds,
};
