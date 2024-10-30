"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const db_1 = tslib_1.__importDefault(require("../../../db"));
const ExpressError_1 = require("../../ExpressError");
const sql_1 = tslib_1.__importDefault(require("../../helpers/sql"));
class Budget {
    static async findAll() {
        const result = await db_1.default.query(`
            SELECT id, name, description, date_created
            FROM budgets`);
        const budgets = result.rows;
        return budgets;
    }
    static async findById(budget_id) {
        const result = await db_1.default.query(`
            SELECT id, name, description, date_created
            FROM budgets
            WHERE id = $1`, [budget_id]);
        const budget = result.rows[0];
        if (!budget)
            return ExpressError_1.NotFoundError;
        return budget;
    }
    static async create({ name, description }) {
        const result = await db_1.default.query(`
            INSERT INTO budgets(name, description)
            VALUES($1, $2)
            RETURNING id, name, description, date_created`, [name, description]);
        const budget = result.rows[0];
        if (!budget)
            return new ExpressError_1.BadRequestError('Invalid Data');
        return budget;
    }
    static async update(id, data) {
        const { name, description } = data;
        //hash password parameter prior to passing it into query string
        const { setCols, values } = (0, sql_1.default)(data, {
            name: 'name',
            description: 'description',
        });
        const budgetVarIdx = '$' + (values.length + 1);
        const result = await db_1.default.query(`     UPDATE budgets
            SET ${setCols}
            WHERE id = ${budgetVarIdx}
            RETURNING id, name, description, date_created`, [...values, id]);
        const budget = result.rows[0];
        if (!budget)
            return new ExpressError_1.NotFoundError(`Budget with ID of ${id} does not exist`);
        return budget;
    }
    static async delete(id) {
        if (!id)
            return new ExpressError_1.BadRequestError(`ID Needed`);
        const budget = await db_1.default.query(`
        SELECT name
        FROM budgets
        WHERE id = $1`, [id]);
        if (!budget) {
            throw new ExpressError_1.NotFoundError(`Budget ID Not Found: ${id}`);
        }
        else {
            return { message: 'Budget deleted' };
        }
    }
}
exports.default = Budget;
//# sourceMappingURL=budget.js.map