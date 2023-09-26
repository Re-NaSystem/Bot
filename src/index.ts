require('dotenv').config();
import { ExtendedClient } from './modules/index';
import { Player } from 'discord-player';

export const client = new ExtendedClient();

console.clear();
client.start();

export const player = new Player(client);
