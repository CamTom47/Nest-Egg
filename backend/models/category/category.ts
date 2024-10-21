import db from '../../db';
import { ExpressError, NotFoundError, BadRequestError, UnauthorizedError } from '../../src/ExpressError';
import sqlForPartialUpdate from '../../helpers/sql';

interface NewCategory {
  name: string;
  description: string;
  systemDefault: boolean;
}
interface UpdateCategory {
  name?: string;
  description?: string;
}

class Category {
  /**
   * Find and return all categories
   *
   * @param {*} user_id = und
   * @returns [categories]
   */

  static async findAll(user_id: number | undefined = undefined): Promise<{}> {
    let query: string = `
            SELECT id, name, description
            FROM categories
            `;

    let whereExpressions: string[] = ['systemDefault = $1'];
    let queryValues: any[] = [true];

    if (user_id !== undefined) {
      queryValues.push(user_id);
      whereExpressions.push(`user_id = $${queryValues.length}`);
    }

    whereExpressions.length === 1
      ? (query += '\n WHERE ' + whereExpressions)
      : (query += '\n WHERE ' + whereExpressions.join(' OR '));

    let result: { rows: [] } = await db.query(query, queryValues);
    let categories: {}[] = result.rows;
    return categories;
  }

  static async findById(category_id: number): Promise<{}> {
    let result: { rows: {}[] } = await db.query(
      `
            SELECT id, name, description
            FROM categories
            WHERE id = $1`,
      [category_id]
    );

    let category: {} | undefined = result.rows[0];

    if (!category) return NotFoundError;

    return category;
  }

  static async create({ name, description, systemDefault = false }: NewCategory): Promise<{}> {
    let result = await db.query(
      `
      INSERT INTO categories ( name, description, systemDefault)
      VALUES ($1, $2, $3)
      RETURNING id, name, description`,
      [name, description, systemDefault]
    );

    let category = result.rows[0];

    if (!category) return BadRequestError;

    return category;
  }

  static async update(id: number, data: UpdateCategory): Promise<{}> {
    const { setCols, values } = sqlForPartialUpdate(data, {
      name: 'name',
      description: 'description',
    });

    const categoryVarIdx = '$' + (values.length + 1);

    const querySql = `UPDATE categories
      SET ${setCols}
      WHERE id = ${categoryVarIdx}
      RETURNING id, name, description`;

    const result = await db.query(querySql, [...values, id]);
    const category = result.rows[0];

    if(!category) return new NotFoundError(`Category not found: invalid ID`);
      
      return category;
  }

  static async delete(id: number): Promise<{}> {
    let result = await db.query(`
      DELETE FROM categories
      WHERE id = $1`, [id]);

      if(!result) return new NotFoundError;

      return {message: "Category Deleted"};
}
}
export default Category
