"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const jsonwebtoken_1 = tslib_1.__importDefault(require("jsonwebtoken"));
const config_1 = require("../../config");
function createToken(user) {
    console.assert(user.isAdmin !== undefined, "createtoken password without isAdmin property");
    let payload = {
        id: user.id,
        username: user.username,
        isAdmin: user.isAdmin || false
    };
    return jsonwebtoken_1.default.sign(payload, config_1.SECRET_KEY);
}
exports.default = createToken;
//# sourceMappingURL=token.js.map