"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExtendedClient = void 0;
const tslib_1 = require("tslib");
const discord_js_1 = require("discord.js");
const glob_1 = tslib_1.__importDefault(require("glob"));
const util_1 = require("util");
const mongoose_1 = tslib_1.__importDefault(require("mongoose"));
const globPromise = (0, util_1.promisify)(glob_1.default);
class ExtendedClient extends discord_js_1.Client {
    checkUserTag(userId) {
        const user = this.users.cache.get(userId);
        const splitted_usertag = user.tag.split('#');
        return splitted_usertag[1] === '0' ? user.username : user?.tag;
    }
    getUserData(userId) {
        const user = this.users.cache.get(userId || '1004365048887660655');
        return {
            icon: user?.avatarURL(),
            username: user?.username,
            usertag: user?.tag,
            userId: user?.id,
            footer: `Producted by ${user?.tag}`,
        };
    }
    connect() {
        if (!process.env.MONGODB_CONNECTION_STRING)
            return false;
        return mongoose_1.default.connect(process.env.MONGODB_CONNECTION_STRING);
    }
    commands = new discord_js_1.Collection();
    constructor() {
        super({
            intents: [
                discord_js_1.IntentsBitField.Flags.Guilds,
                discord_js_1.IntentsBitField.Flags.GuildMembers,
                discord_js_1.IntentsBitField.Flags.MessageContent,
                discord_js_1.IntentsBitField.Flags.GuildMessages,
                discord_js_1.IntentsBitField.Flags.GuildVoiceStates,
                discord_js_1.IntentsBitField.Flags.GuildMessageReactions,
                discord_js_1.IntentsBitField.Flags.GuildInvites,
            ],
        });
    }
    start() {
        this.registerModules().then(() => console.log(`\x1b[32mModules has been loaded \x1b[0m`));
        this.login(process.env.CLIENT_TOKEN).then(() => console.log(`\x1b[36mI am now logged in. \x1b[0m`));
        this.connect();
    }
    async importFile(filePath) {
        return (await Promise.resolve(`${filePath}`).then(s => tslib_1.__importStar(require(s))))?.default;
    }
    async registerModules() {
        const slashCommands = [];
        const commandFiles = await globPromise(__dirname + `/../commands/*/*{.ts,.js}`);
        for (const filePath of commandFiles) {
            const command = await this.importFile(filePath);
            if (!command.name)
                continue;
            console.log(`\x1b[32m/${command.name} has been loaded\x1b[0m`);
            this.commands.set(command.name, command);
            slashCommands.push(command);
        }
        this.on('ready', () => {
            this.application?.commands.set(slashCommands)
                .then(() => {
                console.log(`\x1b[36m${slashCommands.length} slash command successfully registered\x1b[0m`);
            })
                .catch(async (e) => {
                console.log(`\x1b[31mFailed to register slash command.\x1b[0m`);
                console.log(`=> ${e}`);
            });
        });
        const eventFiles = await globPromise(`${__dirname}/../events/*{.ts,.js}`);
        for (const filePath of eventFiles) {
            const event = await this.importFile(filePath);
            this.on(event.event, event.run);
        }
    }
}
exports.ExtendedClient = ExtendedClient;
