"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const categories_1 = tslib_1.__importDefault(require("./routes/categories/categories"));
const dotenv_1 = tslib_1.__importDefault(require("dotenv"));
const express_1 = tslib_1.__importDefault(require("express"));
const cors_1 = tslib_1.__importDefault(require("cors"));
const helmet_1 = tslib_1.__importDefault(require("helmet"));
const ExpressError_1 = require("./ExpressError");
const auth_1 = require("./middleware/auth");
//App Variables
dotenv_1.default.config();
//initialize application
const app = (0, express_1.default)();
//use dependencies
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(auth_1.authenticateJWT);
app.use("/categories", categories_1.default);
app.use(function (req, res, next) {
    return next(new ExpressError_1.NotFoundError());
});
app.use(function (err, req, res, next) {
    if (process.env.NODE_ENV !== 'test')
        console.log(err.stack);
    const status = err.status || 500;
    const message = err.message;
    return res.status(status).json({
        error: { message, status },
    });
});
exports.default = app;
//# sourceMappingURL=index.js.map