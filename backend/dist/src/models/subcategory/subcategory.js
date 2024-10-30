"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const db_1 = tslib_1.__importDefault(require("../../../db"));
const ExpressError_1 = require("../../ExpressError");
const sql_1 = tslib_1.__importDefault(require("../../helpers/sql"));
class Subcategory {
    /**
     * Find and return all subcategories
     *
     * @param {*} user_id = und
     * @returns [subcategories]
     */
    static async findAll(user_id = undefined) {
        let query = `
            SELECT id, name, description, category_id AS "categoryId", user_id AS "userId"
            FROM subcategories
            `;
        let whereExpressions = ['system_default = $1'];
        let queryValues = [true];
        if (user_id !== undefined) {
            queryValues.push(user_id);
            whereExpressions.push(`user_id = $${queryValues.length}`);
        }
        whereExpressions.length === 1
            ? (query += '\n WHERE ' + whereExpressions)
            : (query += '\n WHERE ' + whereExpressions.join(' OR '));
        let result = await db_1.default.query(query, queryValues);
        let subcategories = result.rows;
        return subcategories;
    }
    static async findById(subcategory_id) {
        let result = await db_1.default.query(`
            SELECT id, name, description, category_id AS "categoryId", user_id AS "userId"
            FROM subcategories
            WHERE id = $1`, [subcategory_id]);
        let subcategory = result.rows[0];
        if (!subcategory)
            return ExpressError_1.NotFoundError;
        return subcategory;
    }
    static async create({ name, description, category_id, user_id, system_default = false }) {
        let result = await db_1.default.query(`
      INSERT INTO subcategories ( name, description, category_id, user_id, system_default)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, name, description, category_id AS "categoryId", user_id AS "userId"`, [name, description, category_id, user_id, system_default]);
        let subcategory = result.rows[0];
        if (!subcategory)
            return ExpressError_1.BadRequestError;
        return subcategory;
    }
    static async update(id, data) {
        const { setCols, values } = (0, sql_1.default)(data, {
            name: 'name',
            description: 'description',
            categoryId: 'category_id',
        });
        const categoryVarIdx = '$' + (values.length + 1);
        const querySql = `UPDATE subcategories
      SET ${setCols}
      WHERE id = ${categoryVarIdx}
      RETURNING id, name, description, category_id AS "categoryId", user_id AS "userId"`;
        const result = await db_1.default.query(querySql, [...values, id]);
        const subcategory = result.rows[0];
        if (!subcategory)
            return new ExpressError_1.NotFoundError(`Subcategory not found: invalid ID`);
        return subcategory;
    }
    static async delete(id) {
        let result = await db_1.default.query(`
      DELETE FROM subcategories
      WHERE id = $1`, [id]);
        if (!result)
            return new ExpressError_1.NotFoundError();
        return { message: 'Subcategory Deleted' };
    }
}
exports.default = Subcategory;
//# sourceMappingURL=subcategory.js.map