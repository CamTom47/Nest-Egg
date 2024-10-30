"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const express_1 = tslib_1.__importDefault(require("express"));
const category_1 = tslib_1.__importDefault(require("../../models/category/category"));
const auth_1 = require("../../middleware/auth");
const router = express_1.default.Router();
/**
 * GET /categories => {categories}
 *
 * categories = { id, name, description }
 *
 * Authorization require: logged in
 */
router.get('/', auth_1.ensureLoggedIn, async function (req, res, next) {
    try {
        // let categories;
        // if(req.body.user_id) categories = await Category.findAll(user_id);
        const categories = await category_1.default.findAll();
        return res.json({ categories });
    }
    catch (err) {
        return next(err);
    }
});
exports.default = router;
//# sourceMappingURL=categories.js.map