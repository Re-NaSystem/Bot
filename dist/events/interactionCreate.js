"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../index");
const index_2 = require("../modules/index");
exports.default = new index_2.Event('interactionCreate', async (interaction) => {
    if (interaction.isCommand()) {
        const command = index_1.client.commands.get(interaction.commandName);
        await command?.run({
            args: interaction.options,
            client: index_1.client,
            interaction: interaction,
        });
    }
});
