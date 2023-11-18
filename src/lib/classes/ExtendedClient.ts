import {
  ApplicationCommandDataResolvable,
  Client,
  ClientEvents,
  Collection,
  IntentsBitField,
  User,
} from 'discord.js';
import glob from 'glob';
import { promisify } from 'util';
import mongoose from 'mongoose';
import { I18n } from 'i18n';

import { CommandType } from '@/lib/interfaces/Command';
import { Event } from './Event';
import { Player } from 'discord-player';

const globPromise = promisify(glob);

export class ExtendedClient extends Client {
  public player = new Player(this);

  public i18n = new I18n({
    locales: ['ja_jp', 'en_us'],
    defaultLocale: 'ja_jp',
    directory: __dirname + '/../i18n',
    objectNotation: true,
  });

  checkUserTag(userId: string) {
    const user: User = this.users.cache.get(userId) as User;

    const splitted_usertag = user.tag.split('#');
    return splitted_usertag[1] === '0' ? user.username : user?.tag;
  }

  getUserData(userId?: string) {
    const user: User | undefined = this.users.cache.get(
      userId || '1004365048887660655'
    );

    return {
      icon: user?.avatarURL(),
      username: user?.username,
      usertag: user?.tag,
      userId: user?.id,
      footer: `Producted by ${user?.tag}`,
    } as {
      icon: string;
      username: string;
      usertag: string;
      userId: string;
      footer: string;
    };
  }

  connect() {
    if (!process.env.MONGODB_CONNECTION_STRING) return false;
    return mongoose.connect(process.env.MONGODB_CONNECTION_STRING);
  }

  public commands: Collection<string, CommandType> = new Collection();

  constructor() {
    super({
      intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.MessageContent,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.GuildVoiceStates,
        IntentsBitField.Flags.GuildMessageReactions,
        IntentsBitField.Flags.GuildInvites,
      ],
    });
  }

  start() {
    this.registerModules().then(() =>
      console.log(`\x1b[32mModules has been loaded \x1b[0m`)
    );
    this.login(process.env.CLIENT_TOKEN).then(() =>
      console.log(`\x1b[36mI am now logged in. \x1b[0m`)
    );
    this.connect();
  }

  async importFile(filePath: string) {
    return (await import(filePath))?.default;
  }

  async registerModules() {
    const slashCommands: ApplicationCommandDataResolvable[] = [];

    const commandFiles = await globPromise(
      __dirname + `/../../commands/*/*{.ts,.js}`
    );

    for (const filePath of commandFiles) {
      const command: CommandType = await this.importFile(filePath);
      if (!command.name) continue;

      console.log(`\x1b[32m/${command.name} has been loaded\x1b[0m`);

      this.commands.set(command.name, command);
      slashCommands.push(command);
    }

    this.on('ready', () => {
      this.application?.commands
        .set(slashCommands)
        .then(() => {
          console.log(
            `\x1b[36m${slashCommands.length} slash command successfully registered\x1b[0m`
          );
        })
        .catch(async (e) => {
          console.log(`\x1b[31mFailed to register slash command.\x1b[0m`);

          console.log(`=> ${e}`);
        });
    });

    const eventFiles = await globPromise(`${__dirname}/../../events/*{.ts,.js}`);
    for (const filePath of eventFiles) {
      const event: Event<keyof ClientEvents> = await this.importFile(filePath);
      this.on(event.event, event.run);
    }
  }
}
