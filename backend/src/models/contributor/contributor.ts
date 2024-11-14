import db from "../../../db";
import { ExpressError, NotFoundError, BadRequestError, UnauthorizedError } from "../../ExpressError";
import sqlForPartialUpdate from "../../helpers/sql";

interface NewContributor {
	user_id: number;
	name: string;
	budget_id: number;
	allocation_id: number;
}
interface UpdateContributor {
	name?: string;
}

class Contributor {
	/**
	 * Find and return all contributors
	 *
	 * @param {*} user_id = und
	 * @returns [contributors]
	 */

	static async findAll(user_id: number | undefined = undefined): Promise<{}> {
		console.log(user_id)
		let query: string = `
            SELECT id, name, user_id AS "userId"
            FROM contributors`;

		let whereExpressions: string[] = [];
		let queryValues: any[] = [];

		if (user_id !== undefined) {
			queryValues.push(user_id);
			whereExpressions.push(`user_id = $${queryValues.length}`);
		}

		if (whereExpressions.length === 1) {
			query += "\n WHERE " + whereExpressions;
		}

		let result: { rows: [] } = await db.query(query, queryValues);
		let contributors: {}[] = result.rows;

		if (contributors.length === 0) return new NotFoundError(`No contributors are associated with User ID: ${user_id}`);

		return contributors;
	}

	static async findById(contributor_id: number): Promise<{}> {
		let result: { rows: {}[] } = await db.query(
			`
            SELECT id, name, user_id AS "userId"
            FROM contributors
            WHERE id = $1`,
			[contributor_id]
		);

		let contributor: {} | undefined = result.rows[0];

		if (contributor === undefined) return new NotFoundError();

		return contributor;
	}

	static async create({ name, user_id, budget_id, allocation_id }: NewContributor): Promise<{}> {
		let result = await db.query(
			`
      INSERT INTO contributors ( name, user_id)
      VALUES ($1, $2)
      RETURNING id, user_id AS "userId", name`,
			[name, user_id]
		);

		let contributor = result.rows[0];

		if (!contributor) return BadRequestError;

		this.addContributorBudget(budget_id, contributor.id);
		this.addContributorAllocation(allocation_id, contributor.id);

		return contributor;
	}

	static async update(id: number, data: UpdateContributor): Promise<{}> {
		const { setCols, values } = sqlForPartialUpdate(data, {
			name: "name",
		});

		const contributorVarIdx = "$" + (values.length + 1);

		const querySql = `UPDATE contributors
      SET ${setCols}
      WHERE id = ${contributorVarIdx}
      RETURNING id, name, user_id AS "userId"`;

		const result = await db.query(querySql, [...values, id]);
		const contributor = result.rows[0];

		if (!contributor) return new NotFoundError(`Contributor not found: ${id}`);

		return contributor;
	}

	static async delete(id: number): Promise<{}> {
		let result = await db.query(
			`
      DELETE FROM contributors
      WHERE id = $1`,
			[id]
		);

		if (!result) return new NotFoundError();

		return { message: "Contributor Deleted" };
	}

	static async addContributorBudget(budget_id: number, contributor_id: number) {
		await db.query(
			`
			INSERT INTO budgets_contributors(budget_id, contributor_id)
			VALUES($1, $2)
		`,
			[budget_id, contributor_id]
		);
	}

	static async addContributorAllocation(allocation_id: number, contributor_id: number) {
		await db.query(
			`
			INSERT INTO allocations_contributors (allocation_id, contributor_id)
			VALUES($1, $2)
		`,
			[allocation_id, contributor_id]
		);
	}
}
export default Contributor;
