import db from '../db.ts';
process.env.NODE_ENV = 'test';

let testUserIds: number[] = [];
let testCategoryIds: number[] = [];

async function commonBeforeAll() {
  await db.query('DELETE FROM categories');
  await db.query('DELETE FROM users');

  const resultUser = await db.query(`
        INSERT INTO users(first_name, last_name, username, email, password, is_admin)
        VALUES ( 'testF2', 'testL2', 'testUser2', 'test@test.com', 'testPassword', true),
                ( 'testF', 'testL', 'testUser', 'test@test.com', 'testPassword', true)
        RETURNING id`);

  testUserIds.splice(0, 0, ...resultUser.rows.map((u: {id:number}) => u.id));

  const resultCategory = await db.query(
    `
        INSERT INTO categories(user_id, name, description, systemDefault)
        VALUES ($1, 'testCategory', 'test description 1', true),
              ($1, 'testCategory2', 'test description 2', true),
              ($2, 'testCategory3', 'test description 3', false)
              RETURNING id`,
    [testUserIds[0], testUserIds[1]]
  );

  testCategoryIds.splice(0, 0, ...resultCategory.rows.map((c: {id:number}) => c.id));
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

export { commonBeforeAll, commonAfterAll, commonBeforeEach, commonAfterEach, testCategoryIds, testUserIds };
