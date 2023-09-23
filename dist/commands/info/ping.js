"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const modules_1 = require("../../modules");
exports.default = new modules_1.Command({
    name: 'ping',
    description: 'Measure the response speed of the bot.',
    run: async ({ client, interaction }) => {
        await interaction.deferReply();
        const embed = new discord_js_1.EmbedBuilder()
            .setTitle('🏓 Pong!')
            .setDescription(`WebSocket Ratency: ${client.ws.ping}`)
            .setColor(discord_js_1.Colors.Aqua)
            .setFooter({
            text: client.getUserData().footer,
            iconURL: client.getUserData().icon,
        });
        await interaction.followUp({
            embeds: [embed],
        });
    },
});
