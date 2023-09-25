require('dotenv').config();
import { ExtendedClient } from './modules/index';
const i18n = require('i18n')

export const client = new ExtendedClient();

i18n.configure({
  locales: ['ja_jp', 'en_us'],
  defaultLocale: 'ja_jp',
  directory: '../i18n',
  objectNotation: true,
});

console.clear();
client.start();
