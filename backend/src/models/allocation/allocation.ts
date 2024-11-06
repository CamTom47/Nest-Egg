import { join } from 'path';
import db from '../../../db';
import { ExpressError, NotFoundError, BadRequestError, UnauthorizedError } from '../../ExpressError';
import sqlForPartialUpdate from '../../helpers/sql';

interface NewAllocation {
  amount: number;
  subcategory_id: number;
  budget_id: number;
}
interface Allocation {
  user_id?: number;
  amount?: number;
  subcategory_id?: number;
  budget_id?: number;
}

class Allocation {
  /**
   * Find and return all subcategories
   *
   * @param {*} user_id = und
   * @returns [subcategories]
   */

  static async findAll(user_id: number | undefined = undefined, budget_id: number | undefined = undefined): Promise<{}> {
    let query: string = `
            SELECT allocations.id, amount, subcategory_id AS "subcategoryId", budget_id AS "budgetId", users.id AS "userId" 
            FROM allocations    
            JOIN budgets
            ON allocations.budget_id = budgets.id
            JOIN users ON budgets.user_id = users.id`;

    let whereExpressions: string[] = [];
    let queryValues: any[] = [];

    if (budget_id !== undefined) {
      queryValues.push(budget_id);
      whereExpressions.push(`budget_id = $${queryValues.length}`);
    }
    if (user_id !== undefined) {
      queryValues.push(user_id);
      whereExpressions.push(`users.id = $${queryValues.length}`);
    }

    let allocations: {}[] = []
    
    if (whereExpressions.length > 0) {
      whereExpressions.length > 1 ? (query += '\n WHERE ' + whereExpressions.join(' AND ')) : (query += '\n WHERE ' + whereExpressions)
      let result: { rows: [] } = await db.query(query, queryValues);
      allocations = result.rows;
    } else {
      let result = await db.query(query);
      allocations = result.rows;
    }
    return allocations;
  }

  static async findById(allocation_id: number): Promise<{}> {
    let result: { rows: {}[] } = await db.query(
      `
            SELECT allocations.id, amount, subcategory_id AS "subcategoryId", budget_id AS "budgetId", u.id AS "userId" 
            FROM allocations 
            JOIN budgets 
            ON allocations.budget_id = budgets.id 
            JOIN users AS u 
            ON budgets.user_id = u.id
            WHERE allocations.id = $1`,
      [allocation_id]
    );

    let subcategory: {} | undefined = result.rows[0];
    if (!subcategory) return NotFoundError;
    return subcategory;
  }

  static async create({ amount = 0, subcategory_id, budget_id }: NewAllocation): Promise<{}> {
    let result = await db.query(
      `
      INSERT INTO allocations (amount, subcategory_id, budget_id)
      VALUES ($1, $2, $3)
      RETURNING id, amount, subcategory_id AS "subcategoryId", budget_id AS "budgetId"`,
      [amount, subcategory_id, budget_id]
    );

    let allocation = result.rows[0];

    if (!allocation) return BadRequestError;

    return allocation;
  }

  static async update(id: number, data: UpdateAllocation): Promise<{}> {
    const { setCols, values } = sqlForPartialUpdate(data, {
      amount: 'amount',
      subcategoryId: 'category_id',
      budgetId: 'budget_id',
    });

    const allocationVarIdx = '$' + (values.length + 1);

    const querySql = `UPDATE allocations
      SET ${setCols}
      WHERE id = ${allocationVarIdx}
      RETURNING id, amount, subcategory_id AS "subcategoryId", budget_id AS "budgetId"`;

    const result = await db.query(querySql, [...values, id]);
    const allocation = result.rows[0];

    if (!allocation) return new NotFoundError(`Allocation not found: invalid ID`);

    return allocation;
  }

  static async delete(id?: number): Promise<{}> {
    let result = await db.query(
      `
      DELETE FROM allocations
      WHERE id = $1`,
      [id]
    );

    if (!result) return new NotFoundError();

    return { message: 'Allocation deleted' };
  }
}
export default Allocation;
