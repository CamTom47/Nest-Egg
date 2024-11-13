import db from "../../../db";
import { ExpressError, NotFoundError, BadRequestError, UnauthorizedError } from "../../ExpressError";
import sqlForPartialUpdate from "../../helpers/sql";

interface NewContributor {
	user_id: number;
	name: string;
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

	static async findAll({user_id = undefined}: {user_id: number | undefined}): Promise<{}> {
		let query: string = `
            SELECT id, name, user_id AS "userId"
            FROM contributors`;

		let whereExpressions: string[] = [];
		let queryValues: any[] = [];

		if (user_id !== undefined) {
			queryValues.push(user_id);
			whereExpressions.push(`user_id = $${queryValues.length}`);
		}

		if(whereExpressions.length === 1){
			(query += "\n WHERE " + whereExpressions)
        }

		let result: { rows: [] } = await db.query(query, queryValues);
		let contributors: {}[] = result.rows;

		if(contributors.length === 0) return new NotFoundError(`No contributors are associated with User ID: ${user_id}`)

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

	static async create({ name, user_id }: NewContributor): Promise<{}> {
		let result = await db.query(
			`
      INSERT INTO contributors ( name, user_id)
      VALUES ($1, $2)
      RETURNING id, user_id AS "userId", name`,
			[name, user_id]
		);

		let contributor = result.rows[0];

		if (!contributor) return BadRequestError;

		return contributor;
	}

	static async update(id: number, data: UpdateContributor): Promise<{}> {
		const { setCols, values } = sqlForPartialUpdate(data, {
			name: "name"
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
}
export default Contributor;
