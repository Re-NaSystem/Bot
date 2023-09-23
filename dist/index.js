"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.client = void 0;
require('dotenv').config();
const index_1 = require("./modules/index");
exports.client = new index_1.ExtendedClient();
console.clear();
exports.client.start();
