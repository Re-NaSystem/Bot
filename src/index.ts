require("dotenv").config()
import chalk from "chalk"
import { ExtendedClient } from "./modules/index"
import { ChannelType, Colors, EmbedBuilder, TextChannel } from "discord.js"

export const client = new ExtendedClient()

console.clear()
client.start()