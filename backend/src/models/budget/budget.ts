import db from "../../../db";
import { BadRequestError, NotFoundError } from "../../ExpressError";
import sqlForPartialUpdate from "../../helpers/sql";

interface NewBudget {
	name: string;
	description: string;
	user_id: number;
}
interface UpdateBudget {
	name?: string;
	description?: string;
	user_id?: number;
}

class Budget {
	static async findAll(): Promise<{}> {
		const result = await db.query(`
            SELECT budgets.id, 
            budgets.user_id AS "userId",
             budgets.name,
             description,
             SUM(CASE WHEN a.allocation_type = 1 THEN a.amount END) AS "totalIncome",
             SUM(CASE WHEN a.allocation_type = 2 THEN a.amount END) AS "totalExpense",
             date_created AS "dateCreated"
            FROM budgets
            LEFT JOIN allocations AS a
            ON budgets.id = a.budget_id
            GROUP BY(budgets.id)
            ORDER by(budgets.id)
            `);

		const budgets = result.rows;
		return budgets;
	}

	static async findById(budget_id: number): Promise<{}> {
		const result = await db.query(
			`
           SELECT budgets.id, 
            budgets.user_id AS "userId",
             budgets.name,
             description,
             SUM(CASE WHEN a.allocation_type = 1 THEN a.amount END) AS "totalIncome",
             SUM(CASE WHEN a.allocation_type = 2 THEN a.amount END) AS "totalExpense",
             date_created AS "dateCreated"
            FROM budgets
            LEFT JOIN allocations AS a
            ON budgets.id = a.budget_id
            WHERE budgets.id = $1
            GROUP BY(budgets.id)
            ORDER by(budgets.id)`,
			[budget_id]
		);

		const budget = result.rows[0];

		if (!budget) return NotFoundError;

		return budget;
	}

	static async create({ user_id, name, description }: NewBudget) {
		const result = await db.query(
			`
            INSERT INTO budgets(user_id, name, description)
            VALUES($1, $2, $3)
            RETURNING id, user_id AS "userId", name, description, date_created AS "dateCreated"`,
			[user_id, name, description]
		);

		const budget = result.rows[0];
		if (!budget) return new BadRequestError("Invalid Data");

		return budget;
	}

	static async update(id: number, data: UpdateBudget) {
		const { name, description } = data;

		//hash password parameter prior to passing it into query string

		const { setCols, values } = sqlForPartialUpdate(data, {
			name: "name",
			description: "description",
		});

		const budgetVarIdx = "$" + (values.length + 1);

		const result = await db.query(
			`     UPDATE budgets
            SET ${setCols}
            WHERE id = ${budgetVarIdx}
            RETURNING id, user_id AS "userId", name, description, date_created AS "dateCreated"`,
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
			return { message: "Budget deleted" };
		}
	}
}

export default Budget;
