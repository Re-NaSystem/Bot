import {
  ChatInputApplicationCommandData,
  ChatInputCommandInteraction,
  CommandInteractionOptionResolver,
  PermissionResolvable,
} from 'discord.js';
import { ExtendedClient } from '../modules/Client';

interface RunOptions {
  client: ExtendedClient;
  interaction: ChatInputCommandInteraction;
  args: CommandInteractionOptionResolver;
}

type RunFunction = (options: RunOptions) => any;

export type CommandType = {
  userPermissions?: PermissionResolvable[];
  run: RunFunction;
} & ChatInputApplicationCommandData;
