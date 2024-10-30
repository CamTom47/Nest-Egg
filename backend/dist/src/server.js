'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
//Importing Libraries
const dotenv_1 = tslib_1.__importDefault(require("dotenv"));
const index_1 = tslib_1.__importDefault(require("./index"));
dotenv_1.default.config();
/*
  ===============================================================
 Importing the port set on the .env, if the port number is not set on .env or the port is being used by another server
running on the local macchine we are asking the app to use 3001 as the port number
  ===============================================================
*/
const PORT = process.env.PORT || 3001;
//Listing to the app and running it on PORT 5000
index_1.default.listen(PORT, () => {
    console.log(`Listening on port: ${PORT}`);
});
//# sourceMappingURL=server.js.map