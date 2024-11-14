import db from "../../../db";
import { ExpressError, NotFoundError, BadRequestError, UnauthorizedError } from "../../ExpressError";
import sqlForPartialUpdate from "../../helpers/sql";

interface NewAllocation {
	budget_id: number;
	category_id: number;
	subcategory_id: number;
	user_id: number;
	allocation_type: number;
	expense_type: number;
	amount: number;
	frequency: number;
}
interface Allocation {
	category_id?: number;
	subcategory_id?: number;
	user_id: number;
	allocation_type?: number;
	expense_type?: number;
	amount?: number;
	frequency?: number;
}
interface UpdateAllocation {
	category_id?: number;
	subcategory_id?: number;
	allocation_type?: number;
	expense_type?: number;
	amount?: number;
	frequency?: number;
}

class Allocation {
	/**
	 * Find and return all subcategories
	 *
	 * @param {*} user_id = und
	 * @returns [subcategories]
	 */

	static async findAll(
		user_id: number | undefined = undefined,
		budget_id: number | undefined = undefined
	): Promise<{}> {
		let query: string = `
            SELECT id, amount, subcategory_id AS "subcategoryId", budget_id AS "budgetId", user_id AS "userId", category_id AS "categoryId", allocation_type AS "allocationType", expense_type AS "expenseType", frequency
            FROM allocations`;

		let whereExpressions: string[] = [];
		let queryValues: any[] = [];

		if (budget_id !== undefined) {
			queryValues.push(budget_id);
			whereExpressions.push(`budget_id = $${queryValues.length}`);
		}
		if (user_id !== undefined) {
			queryValues.push(user_id);
			whereExpressions.push(`user_id = $${queryValues.length}`);
		}

		let allocations: {}[] = [];

		if (whereExpressions.length > 0) {
			whereExpressions.length > 1
				? (query += "\n WHERE " + whereExpressions.join(" AND "))
				: (query += "\n WHERE " + whereExpressions);
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
            SELECT id, amount, subcategory_id AS "subcategoryId", budget_id AS "budgetId", user_id AS "userId", category_id AS "categoryId", allocation_type AS "allocationType", expense_type AS "expenseType", frequency
            FROM allocations
            WHERE id = $1`,
			[allocation_id]
		);

		let subcategory: {} | undefined = result.rows[0];
		if (!subcategory) return NotFoundError;
		return subcategory;
	}

	static async create({
		budget_id,
		category_id,
		subcategory_id,
		user_id,
		allocation_type,
		expense_type,
		amount = 0,
		frequency,
	}: NewAllocation): Promise<{}> {
		let result = await db.query(
			`
      INSERT INTO allocations (budget_id, category_id, subcategory_id, user_id, allocation_type, expense_type, amount, frequency)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING id, amount, subcategory_id AS "subcategoryId", budget_id AS "budgetId", user_id AS "userId", category_id AS "categoryId", allocation_type AS "allocationType", expense_type AS "expenseType", frequency`,
			[budget_id, category_id, subcategory_id, user_id, allocation_type, expense_type, amount, frequency]
		);

		let allocation = result.rows[0];

		if (!allocation) return BadRequestError;

		return allocation;
	}

	static async update(id: number, data: UpdateAllocation): Promise<{}> {
		const { setCols, values } = sqlForPartialUpdate(data, {
			category_id: "categoryId",
			subcategory_id: "subcategoryId",
			allocation_type: "allocationType",
			expense_type: "expenseType",
			amount: "amount",
			frequency: "frequency",
		});

		const allocationVarIdx = "$" + (values.length + 1);

		const querySql = `UPDATE allocations
      SET ${setCols}
      WHERE id = ${allocationVarIdx}
      RETURNING id, amount, subcategory_id AS "subcategoryId", budget_id AS "budgetId", user_id AS "userId", category_id AS "categoryId", allocation_type AS "allocationType", expense_type AS "expenseType", frequency`;

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

		return { message: "Allocation deleted" };
	}
}
export default Allocation;
