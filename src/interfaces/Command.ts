import {
  ChatInputApplicationCommandData,
  ChatInputCommandInteraction,
  CommandInteractionOptionResolver,
  Message,
  PermissionResolvable,
} from 'discord.js';
import { ExtendedClient } from '@/lib/classes/ExtendedClient';

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
