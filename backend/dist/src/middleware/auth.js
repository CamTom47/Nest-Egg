"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ensureCorrectUserOrAdmin = exports.ensureLoggedIn = exports.authenticateJWT = void 0;
const tslib_1 = require("tslib");
const jsonwebtoken_1 = tslib_1.__importDefault(require("jsonwebtoken"));
const config_1 = require("../../config");
const ExpressError_1 = require("../../src/ExpressError");
/** Middleware: Authenticate user.
 *
 * If a token was provided, verify it, and, if valid, store the token payload
 * on res.locals (this will include the username and isAdmin field.)
 *
 * It's not an error if no token was provided or if the token is not valid.
 */
const authenticateJWT = (req, res, next) => {
    try {
        const authHeader = req.headers && req.headers.authorization;
        if (authHeader) {
            const token = authHeader.replace(/^[Bb]earer /, "").trim();
            res.locals.user = jsonwebtoken_1.default.verify(token, config_1.SECRET_KEY);
        }
    }
    catch (err) {
        return next(err);
    }
};
exports.authenticateJWT = authenticateJWT;
/** Middleware to use when they must be logged in.
 *
 * If not, raises Unauthorized.
 */
const ensureLoggedIn = (req, res, next) => {
    try {
        if (!res.locals.user)
            throw new ExpressError_1.UnauthorizedError();
        return next();
    }
    catch (err) {
        return next(err);
    }
};
exports.ensureLoggedIn = ensureLoggedIn;
/** Middleware to user when a user must be logged in or needs to be an admin
 *
 * If not, raises Unauthorized
 */
const ensureAdmin = (req, res, next) => {
    try {
        if (!res.locals.user.isAdmin)
            throw new ExpressError_1.UnauthorizedError();
        return next();
    }
    catch (err) {
        return next(err);
    }
};
const ensureCorrectUserOrAdmin = (req, res, next) => {
    try {
        let user = res.locals.user;
        if (!(user && (user.isAdmin || user.username === req.params.username))) {
            throw new ExpressError_1.UnauthorizedError();
        }
        return next();
    }
    catch (err) {
        return next(err);
    }
};
exports.ensureCorrectUserOrAdmin = ensureCorrectUserOrAdmin;
//# sourceMappingURL=auth.js.map