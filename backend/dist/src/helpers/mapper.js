"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let categoryMap = {
    "name": "name",
    "description": "description",
    "userId": "user_id",
    "systemDefault": "system_default"
};
/**
 * Mapper function that ensure that data being passed from frontend to backend queries is in the correct form
 *
 *  data = { name, description, userId, systemDefault } => {name, description, user_id, system_default}
 */
const mapper = (data, type) => {
    let map = {};
    if (type = "category")
        map = categoryMap;
    console.log(map);
    const keyValues = Object.entries(data);
    console.log(keyValues);
    let mappedObj = {};
    for (let [key, value] of keyValues) {
        console.log(map[key]);
        mappedObj[map[key]] = value;
    }
    return mappedObj;
};
exports.default = mapper;
//# sourceMappingURL=mapper.js.map