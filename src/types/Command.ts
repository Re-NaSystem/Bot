import {
  ChatInputApplicationCommandData,
  ChatInputCommandInteraction,
  CommandInteractionOptionResolver,
  Message,
  PermissionResolvable,
} from 'discord.js';
import { ExtendedClient } from '../modules/Client';

interface RunOptions {
  client: ExtendedClient;
  interaction: ChatInputCommandInteraction;
  args: CommandInteractionOptionResolver;
}

type RunFunction = (options: RunOptions) => any;

type ChatCommandRunFunction = (options: { client: ExtendedClient, message: Message, args: string[] }) => any;

export type CommandType = {
  userPermissions?: PermissionResolvable[];
  run: RunFunction;
} & ChatInputApplicationCommandData;

export type ChatCommandType = {
  name: string;
  description: string;
  run: ChatCommandRunFunction 
}