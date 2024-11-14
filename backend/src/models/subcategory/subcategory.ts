import db from '../../../db';
import { ExpressError, NotFoundError, BadRequestError, UnauthorizedError } from '../../ExpressError';
import sqlForPartialUpdate from '../../helpers/sql';

interface NewSubcategory {
  name: string;
  category_id: number;
  user_id: number;
  system_default: boolean;
}
interface UpdateSubcategory {
  name?: string;
  category_id?: number;
  user_id?: number;
}

class Subcategory {
  /**
   * Find and return all subcategories
   *
   * @param {*} user_id = und
   * @returns [subcategories]
   */

  static async findAll(user_id: number | undefined = undefined): Promise<{}> {
    let query: string = `
            SELECT id, name, category_id AS "categoryId", user_id AS "userId"
            FROM subcategories
            `;

    let whereExpressions: string[] = ['system_default = $1'];
    let queryValues: any[] = [true];

    if (user_id !== undefined) {
      queryValues.push(user_id);
      whereExpressions.push(`user_id = $${queryValues.length}`);
    }

    whereExpressions.length === 1
      ? (query += '\n WHERE ' + whereExpressions)
      : (query += '\n WHERE ' + whereExpressions.join(' OR '));

    let result: { rows: [] } = await db.query(query, queryValues);
    let subcategories: {}[] = result.rows;
    return subcategories;
  }

  static async findById(subcategory_id: number): Promise<{}> {
    let result: { rows: {}[] } = await db.query(
      `
            SELECT id, name, category_id AS "categoryId", user_id AS "userId"
            FROM subcategories
            WHERE id = $1`,
      [subcategory_id]
    );

    let subcategory: {} | undefined = result.rows[0];

    if (!subcategory) throw new  NotFoundError;

    return subcategory;
  }

  static async create({ name, category_id, user_id, system_default = false }: NewSubcategory): Promise<{}> {
    let result = await db.query(
      `
      INSERT INTO subcategories ( name, category_id, user_id, system_default)
      VALUES ($1, $2, $3, $4)
      RETURNING id, name, category_id AS "categoryId", user_id AS "userId"`,
      [name, category_id, user_id, system_default]
    );

    let subcategory = result.rows[0];

    if (!subcategory) return BadRequestError;

    return subcategory;
  }

  static async update(id: number, data: UpdateSubcategory): Promise<{}> {
    const { setCols, values } = sqlForPartialUpdate(data, {
      name: 'name',
      categoryId: 'category_id',
    });

    const categoryVarIdx = '$' + (values.length + 1);

    const querySql = `UPDATE subcategories
      SET ${setCols}
      WHERE id = ${categoryVarIdx}
      RETURNING id, name, category_id AS "categoryId", user_id AS "userId"`;

    const result = await db.query(querySql, [...values, id]);
    const subcategory = result.rows[0];

    if (!subcategory) throw new NotFoundError(`Subcategory not found: invalid ID`);

    return subcategory;
  }

  static async delete(id: number): Promise<{}> {
    let result = await db.query(
      `
      DELETE FROM subcategories
      WHERE id = $1`,
      [id]
    );

    if (!result) return new NotFoundError();

    return { message: 'Subcategory Deleted' };
  }
}
export default Subcategory;
