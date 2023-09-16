import {
  ChatInputCommandInteraction,
  CommandInteractionOptionResolver,
} from "discord.js"
import { client } from "../index"
import { Event } from "../modules/index"

export default new Event("messageCreate", async (message) => {
  if (
    message.author.bot ||
    !message.guild ||
    !message.content.toLowerCase().startsWith(process.env.PREFIX)
  ) return;
  const [cmd, ...args] = message.content
    .slice(process.env.PREFIX.length)
    .trim()
    .split(/ +/g);

  const command = client.chatCommands.get(cmd.toLowerCase());
  
  if (!command) return;

  await command?.run({
    client: client,
    message: message,
    args: args,
  })
})