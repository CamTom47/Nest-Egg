import db from "../../../db";
import { BadRequestError, NotFoundError } from "../../../src/ExpressError";
import bcrypt from "bcrypt";
import { BCRYPT_WORK_FACTOR } from "../../../config";
import sqlForPartialUpdate from "../../helpers/sql";

interface NewUser {
	first_name: string;
	last_name: string;
	username: string;
	password: string;
	email: string;
	is_admin: boolean;
}
interface UpdateUser {
	first_name?: string;
	last_name?: string;
	username?: string;
	password?: string;
	email?: string;
	is_admin?: boolean;
}

class User {
	static async findAll(): Promise<{}> {
		const result = await db.query(`
            SELECT users.id, first_name AS "firstName", last_name AS "lastName", username, email, is_admin AS "isAdmin", COUNT(b) AS "NumberOfBudgets"
            FROM users
            JOIN budgets AS b
            ON users.id = budgets.user_id
            GROUP BY(users.id)
            `);

		const users = result.rows;
		return users;
	}

	static async findById(user_id: number): Promise<{}> {
		const result = await db.query(
			`
            SELECT users.id, first_name AS "firstName", last_name AS "lastName", username, email, is_admin AS "isAdmin", COUNT(b) AS "NumberOfBudgets"
            FROM users
            LEFT JOIN budgets AS b
            ON users.id = b.user_id
			WHERE users.id = $1
            GROUP BY(users.id)
			`,
			[user_id]
		);

		const user = result.rows[0];

		if (!user) throw new NotFoundError();

		return user;
	}
	static async authenticate(username: string, password: string) {
		const result = await db.query(
			`
        SELECT users.id, users.password, first_name AS "firstName", last_name AS "lastName", username, email, is_admin AS "isAdmin", COUNT(b) AS "NumberOfBudgets"
            FROM users
            LEFT JOIN budgets AS b
            ON users.id = b.user_id
			WHERE users.username = $1
			GROUP BY(users.id)`,
			[username]
		);

		const user = result.rows[0];

		if (user) {
			const isValid = await bcrypt.compare(password, user.password);
			if (isValid === true) {
				delete user.password;
				return user;
			}
		}

		return new NotFoundError("Invalid Username/Password");
	}

	static async register({ first_name, last_name, username, password, email, is_admin = false }: NewUser) {
		//check to make sure that this username is available

		const userCheck = await db.query(
			`
            SELECT username
            FROM users
            WHERE username = $1`,
			[username]
		);

		if (!userCheck) return new BadRequestError(`Username ${username} is already taken`);

		//hash password parameter prior to passing it into query string

		const hashedPassword = await bcrypt.hash(password, BCRYPT_WORK_FACTOR);

		const result = await db.query(
			`
            INSERT INTO users(first_name, last_name, username, password, email, is_admin)
            VALUES($1, $2, $3, $4, $5, $6)
            RETURNING id, username, first_name AS "firstName", last_name AS "lastName", email, is_admin AS "isAdmin"`,
			[first_name, last_name, username, hashedPassword, email, is_admin]
		);

		const user = result.rows[0];
		if (!user) return new BadRequestError("Invalid Data");
		return user;
	}

	static async update(id: number, data: UpdateUser) {
		const { first_name, last_name, username, password, email, is_admin } = data;

		//check to make sure that this username is available

		const userCheck = await db.query(
			`
            SELECT username
            FROM users
            WHERE username = $1`,
			[data.username]
		);

		if (!userCheck) return new BadRequestError(`Username ${username} is already taken`);

		//hash password parameter prior to passing it into query string

		if (data.password) {
			data.password = await bcrypt.hash(password, BCRYPT_WORK_FACTOR);
		}

		const { setCols, values } = sqlForPartialUpdate(data, {
			firstName: "first_name",
			lastName: "last_name",
			password: "password",
			email: "email",
			isAdmin: "is_admin",
			username: "username",
		});

		const userVarIdx = "$" + (values.length + 1);

		const result = await db.query(
			`     UPDATE users
            SET ${setCols}
            WHERE id = ${userVarIdx}
            RETURNING id, username, first_name AS "firstName", last_name AS "lastName", email, is_admin AS "isAdmin"`,
			[...values, id]
		);

		const user = result.rows[0];
		if (!user) throw new NotFoundError(`User with ID of ${id} does not exist`);

		return user;
	}

	static async delete(id: number) {
		if (!id) return new BadRequestError(`ID Needed`);

		const result = await db.query(
			`
        SELECT username
        FROM users
        WHERE id = $1`,
			[id]
		);

		const user = result.rows[0];

		if (!user) {
			throw new NotFoundError(`User ID Not Found: ${id}`);
		} else {
			return { message: "User deleted" };
		}
	}
}

export default User;
