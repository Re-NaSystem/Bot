require('dotenv').config();
import { ExtendedClient } from './modules/index';
import i18n from 'i18n';

export const client = new ExtendedClient();

i18n.configure({
  locales: ['ja_jp', 'en_us'],
  defaultLocale: 'ja_jp',
  directory: '../i18n',
  objectNotation: true,
});

console.clear();
client.start();
