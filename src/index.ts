require('dotenv').config();
import { ExtendedClient } from './modules/index';

export const client = new ExtendedClient();

console.clear();
client.start();
