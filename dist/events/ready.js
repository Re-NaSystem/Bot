"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("..");
const index_1 = require("../modules/index");
exports.default = new index_1.Event('ready', async () => {
    console.log(`\x1b[36m${__1.client.user?.tag} is now ready!\x1b[0m`);
    console.log(`\x1b[33mInvite link: https://discord.com/api/oauth2/authorize?client_id=${__1.client.user?.id}&permissions=8&scope=applications.commands%20bot\x1b[0m`);
    console.log(`\x1b[32mWebSocket Ratency: ${__1.client.ws.ping}\x1b[0m`);
});
