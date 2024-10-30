"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const db_1 = tslib_1.__importDefault(require("../../../db"));
const ExpressError_1 = require("../../../src/ExpressError");
const bcrypt_1 = tslib_1.__importDefault(require("bcrypt"));
const config_1 = require("../../../config");
const sql_1 = tslib_1.__importDefault(require("../../helpers/sql"));
class User {
    static async findAll() {
        const result = await db_1.default.query(`
            SELECT id, first_name AS "firstName", last_name AS "lastName", username, email, is_admin AS "isAdmin"
            FROM users`);
        const users = result.rows;
        return users;
    }
    static async findById(user_id) {
        const result = await db_1.default.query(`
            SELECT id, first_name AS "firstName", last_name AS "lastName", username, email, is_admin AS "isAdmin"
            FROM users
            WHERE id = $1`, [user_id]);
        const user = result.rows[0];
        if (!user)
            return ExpressError_1.NotFoundError;
        return user;
    }
    static async authenticate(username, password) {
        const result = await db_1.default.query(`
        SELECT id,
                password,
                first_name AS "firstName",
                last_name AS "lastName",
                username,
                email,
                is_admin AS "isAdmin"
        FROM users
        WHERE username = $1`, [username]);
        const user = result.rows[0];
        if (user) {
            console.log(password, user.password);
            const isValid = await bcrypt_1.default.compare(password, user.password);
            console.log(isValid);
            if (isValid === true) {
                delete user.password;
                return user;
            }
        }
        return new ExpressError_1.NotFoundError('Invalid Username/Password');
    }
    static async register({ first_name, last_name, username, password, email, is_admin = false }) {
        //check to make sure that this username is available
        const userCheck = await db_1.default.query(`
            SELECT username
            FROM users
            WHERE username = $1`, [username]);
        if (!userCheck)
            return new ExpressError_1.BadRequestError(`Username ${username} is already taken`);
        //hash password parameter prior to passing it into query string
        const hashedPassword = await bcrypt_1.default.hash(password, config_1.BCRYPT_WORK_FACTOR);
        const result = await db_1.default.query(`
            INSERT INTO users(first_name, last_name, username, password, email, is_admin)
            VALUES($1, $2, $3, $4, $5, $6)
            RETURNING id, username, first_name AS "firstName", last_name AS "lastName", email, is_admin AS "isAdmin"`, [first_name, last_name, username, hashedPassword, email, is_admin]);
        const user = result.rows[0];
        if (!user)
            return new ExpressError_1.BadRequestError('Invalid Data');
        return user;
    }
    static async update(id, data) {
        const { first_name, last_name, username, password, email, is_admin } = data;
        //check to make sure that this username is available
        const userCheck = await db_1.default.query(`
            SELECT username
            FROM users
            WHERE username = $1`, [data.username]);
        if (!userCheck)
            return new ExpressError_1.BadRequestError(`Username ${username} is already taken`);
        //hash password parameter prior to passing it into query string
        if (data.password) {
            data.password = await bcrypt_1.default.hash(password, config_1.BCRYPT_WORK_FACTOR);
        }
        const { setCols, values } = (0, sql_1.default)(data, {
            firstName: 'first_name',
            lastName: 'last_name',
            password: 'password',
            email: 'email',
            isAdmin: 'is_admin',
            username: 'username',
        });
        const userVarIdx = '$' + (values.length + 1);
        const result = await db_1.default.query(`     UPDATE users
            SET ${setCols}
            WHERE id = ${userVarIdx}
            RETURNING id, username, password, first_name AS "firstName", last_name AS "lastName", email, is_admin AS "isAdmin"`, [...values, id]);
        const user = result.rows[0];
        if (!user)
            return new ExpressError_1.NotFoundError(`User with ID of ${id} does not exist`);
        return user;
    }
    static async delete(id) {
        if (!id)
            return new ExpressError_1.BadRequestError(`ID Needed`);
        const user = await db_1.default.query(`
        SELECT username
        FROM users
        WHERE id = $1`, [id]);
        if (!user) {
            throw new ExpressError_1.NotFoundError(`User ID Not Found: ${id}`);
        }
        else {
            return { message: 'User deleted' };
        }
    }
}
exports.default = User;
//# sourceMappingURL=user.js.map