import {
  ApplicationCommandDataResolvable,
  Client,
  ClientEvents,
  Collection,
  IntentsBitField,
  User,
} from 'discord.js';
import { CommandType } from '../types/Command';
import glob from 'glob';
import { promisify } from 'util';
import { Event } from './Event';
import chalk from 'chalk';
import mongoose from 'mongoose';
const globPromise = promisify(glob);

export class ExtendedClient extends Client {
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
      console.log(chalk.cyan(`[+] モジュールを読み込みました`))
    );
    this.login(process.env.CLIENT_TOKEN).then(() =>
      console.log(chalk.cyan(`[+] ログインしました`))
    );
    this.connect();
  }

  async importFile(filePath: string) {
    return (await import(filePath))?.default;
  }

  async registerModules() {
    const slashCommands: ApplicationCommandDataResolvable[] = [];

    const commandFiles = await globPromise(
      __dirname + `/../commands/*/*{.ts,.js}`
    );

    for (const filePath of commandFiles) {
      const command: CommandType = await this.importFile(filePath);
      if (!command.name) continue;
      console.log(
        chalk.green(`[+] /${command.name}を読み込みました(${filePath})`)
      );
      this.commands.set(command.name, command);
      slashCommands.push(command);
    }

    this.on('ready', () => {
      this.application?.commands.set([]);
      this.guilds.cache
        .map((guild) => guild.id)
        .forEach((guildId) => {
          const guild = this.guilds.cache.get(guildId);
          guild?.commands.set([]);
          guild?.commands
            .set(slashCommands)
            .then(() => {
              console.log(
                chalk.green(
                  `[+] ${guild?.name}で${slashCommands.length}個のスラッシュコマンドを正常に登録しました`
                )
              );
            })
            .catch(async (e) => {
              console.log(
                chalk.red(
                  `[-] ${guild?.name}でスラッシュコマンドの登録に失敗しました`
                )
              );
              console.log(`=> ${e}`);
            });
        });
    });

    const eventFiles = await globPromise(`${__dirname}/../events/*{.ts,.js}`);
    for (const filePath of eventFiles) {
      const event: Event<keyof ClientEvents> = await this.importFile(filePath);
      this.on(event.event, event.run);
    }
  }
}
