"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const db_1 = tslib_1.__importDefault(require("../../../db"));
const ExpressError_1 = require("../../ExpressError");
const sql_1 = tslib_1.__importDefault(require("../../helpers/sql"));
class Allocation {
    /**
     * Find and return all subcategories
     *
     * @param {*} user_id = und
     * @returns [subcategories]
     */
    static async findAll(budget_id = undefined) {
        let query = `
            SELECT id, amount, subcategory_id AS "subcategoryId", budget_id AS "budgetId"
            FROM allocations
            `;
        let whereExpressions = [];
        let queryValues = [];
        if (budget_id !== undefined) {
            queryValues.push(budget_id);
            whereExpressions.push(`budget_id = $${queryValues.length}`);
        }
        if (whereExpressions.length > 0) {
            whereExpressions.length < 1
                ? (query += '\n WHERE ' + whereExpressions)
                : (query += '\n WHERE ' + whereExpressions.join(' OR '));
            let result = await db_1.default.query(query, queryValues);
            let allocations = result.rows;
            return allocations;
        }
        else {
            let result = await db_1.default.query(query);
            let allocations = result.rows;
            return allocations;
        }
    }
    static async findById(allocation_id) {
        let result = await db_1.default.query(`
            SELECT id, amount, subcategory_id AS "subcategoryId", budget_id AS "budgetId"
            FROM allocations
            WHERE id = $1`, [allocation_id]);
        let subcategory = result.rows[0];
        if (!subcategory)
            return ExpressError_1.NotFoundError;
        return subcategory;
    }
    static async create({ amount = 0, subcategory_id, budget_id }) {
        let result = await db_1.default.query(`
      INSERT INTO allocations (amount, subcategory_id, budget_id)
      VALUES ($1, $2, $3)
      RETURNING id, amount, subcategory_id AS "subcategoryId", budget_id AS "budgetId"`, [amount, subcategory_id, budget_id]);
        let allocation = result.rows[0];
        if (!allocation)
            return ExpressError_1.BadRequestError;
        return allocation;
    }
    static async update(id, data) {
        const { setCols, values } = (0, sql_1.default)(data, {
            amount: 'amount',
            subcategoryId: 'category_id',
            budgetId: 'budget_id',
        });
        const allocationVarIdx = '$' + (values.length + 1);
        const querySql = `UPDATE allocations
      SET ${setCols}
      WHERE id = ${allocationVarIdx}
      RETURNING id, amount, subcategory_id AS "subcategoryId", budget_id AS "budgetId"`;
        const result = await db_1.default.query(querySql, [...values, id]);
        const allocation = result.rows[0];
        if (!allocation)
            return new ExpressError_1.NotFoundError(`Allocation not found: invalid ID`);
        return allocation;
    }
    static async delete(id) {
        let result = await db_1.default.query(`
      DELETE FROM allocations
      WHERE id = $1`, [id]);
        if (!result)
            return new ExpressError_1.NotFoundError();
        return { message: 'Allocation deleted' };
    }
}
exports.default = Allocation;
//# sourceMappingURL=allocation.js.map