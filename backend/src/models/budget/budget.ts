import db from '../../../db';
import { BadRequestError, NotFoundError } from '../../ExpressError';
import sqlForPartialUpdate from '../../helpers/sql';

interface NewBudget {
  name: string;
  description: string;
}
interface UpdateBudget {
  name?: string;
  description?: string;
}

class Budget {
  static async findAll(): Promise<{}> {
    const result = await db.query(`
            SELECT id, name, description, date_created
            FROM budgets`);

    const budgets = result.rows;
    return budgets;
  }

  static async findById(budget_id: number): Promise<{}> {
    const result = await db.query(
      `
            SELECT id, name, description, date_created
            FROM budgets
            WHERE id = $1`,
      [budget_id]
    );

    const budget = result.rows[0];

    if (!budget) return NotFoundError;

    return budget;
  }

  static async create({ name, description }: NewBudget) {
    const result = await db.query(
      `
            INSERT INTO budgets(name, description)
            VALUES($1, $2)
            RETURNING id, name, description, date_created`,
      [name, description]
    );

    const budget = result.rows[0];
    if (!budget) return new BadRequestError('Invalid Data');
    return budget;
  }

  static async update(id: number, data: UpdateBudget) {
    const { name, description } = data;

    //hash password parameter prior to passing it into query string

    const { setCols, values } = sqlForPartialUpdate(data, {
      name: 'name',
      description: 'description',
    });

    const budgetVarIdx = '$' + (values.length + 1);

    const result = await db.query(
      `     UPDATE budgets
            SET ${setCols}
            WHERE id = ${budgetVarIdx}
            RETURNING id, name, description, date_created`,
      [...values, id]
    );

    const budget = result.rows[0];
    if (!budget) return new NotFoundError(`Budget with ID of ${id} does not exist`);

    return budget;
  }

  static async delete(id: number) {
    if (!id) return new BadRequestError(`ID Needed`);

    const budget: {} = await db.query(
      `
        SELECT name
        FROM budgets
        WHERE id = $1`,
      [id]
    );

    if (!budget) {
      throw new NotFoundError(`Budget ID Not Found: ${id}`);
    } else {
      return { message: 'Budget deleted' };
    }
  }
}

export default Budget;
