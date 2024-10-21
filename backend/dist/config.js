"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BCRYPT_WORK_FACTOR = exports.PORT = exports.SECRET_KEY = void 0;
exports.getDatabaseUri = getDatabaseUri;
const tslib_1 = require("tslib");
/** Shared configuration for application; can be required many places */
const dotenv_1 = tslib_1.__importDefault(require("dotenv"));
dotenv_1.default.config();
const SECRET_KEY = process.env.PORT || "secret-dev";
exports.SECRET_KEY = SECRET_KEY;
const PORT = process.env.PORT || 3001;
exports.PORT = PORT;
// Use database, testing database, or via env var, production database
function getDatabaseUri() {
    return (process.env.NODE_ENV === "test")
        ? "postgresql:///nestegg_test"
        : process.env.DATABASE_URL || "posgresql:///nestegg";
}
//Speed up bcrypt during ests, since the algorithm safety isn't being tested
const BCRYPT_WORK_FACTOR = process.env.NODE_ENV === "test" ? 1 : 12;
exports.BCRYPT_WORK_FACTOR = BCRYPT_WORK_FACTOR;
//# sourceMappingURL=config.js.map