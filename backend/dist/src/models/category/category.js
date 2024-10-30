"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const db_1 = tslib_1.__importDefault(require("../../../db"));
const ExpressError_1 = require("../../../src/ExpressError");
const sql_1 = tslib_1.__importDefault(require("../../helpers/sql"));
class Category {
    /**
     * Find and return all categories
     *
     * @param {*} user_id = und
     * @returns [categories]
     */
    static async findAll(user_id = undefined) {
        let query = `
            SELECT id, name, description
            FROM categories
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
        let categories = result.rows;
        return categories;
    }
    static async findById(category_id) {
        let result = await db_1.default.query(`
            SELECT id, name, description
            FROM categories
            WHERE id = $1`, [category_id]);
        let category = result.rows[0];
        if (!category)
            return ExpressError_1.NotFoundError;
        return category;
    }
    static async create({ name, description, system_default = false }) {
        let result = await db_1.default.query(`
      INSERT INTO categories ( name, description, system_default)
      VALUES ($1, $2, $3)
      RETURNING id, name, description`, [name, description, system_default]);
        let category = result.rows[0];
        if (!category)
            return ExpressError_1.BadRequestError;
        return category;
    }
    static async update(id, data) {
        const { setCols, values } = (0, sql_1.default)(data, {
            name: 'name',
            description: 'description',
        });
        const categoryVarIdx = '$' + (values.length + 1);
        const querySql = `UPDATE categories
      SET ${setCols}
      WHERE id = ${categoryVarIdx}
      RETURNING id, name, description`;
        const result = await db_1.default.query(querySql, [...values, id]);
        const category = result.rows[0];
        if (!category)
            return new ExpressError_1.NotFoundError(`Category not found: invalid ID`);
        return category;
    }
    static async delete(id) {
        let result = await db_1.default.query(`
      DELETE FROM categories
      WHERE id = $1`, [id]);
        if (!result)
            return new ExpressError_1.NotFoundError;
        return { message: "Category Deleted" };
    }
}
exports.default = Category;
//# sourceMappingURL=category.js.map