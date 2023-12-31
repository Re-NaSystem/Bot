require('dotenv').config();
import { EmbedBuilder, Colors } from 'discord.js';
import { ExtendedClient } from '@/lib/classes/ExtendedClient';
import { Player } from 'discord-player';

export const client = new ExtendedClient();

console.clear();
client.start();

export const player = new Player(client);

client.player.events.on('playerStart', (queue, track) => {
  queue.metadata.send({
    embeds: [
      new EmbedBuilder()
        .setTitle(
          client.i18n
            .__('command.track.event.playing')
            .replace('{track}', track.title)
        )
        .setThumbnail(track.thumbnail)
        .setColor(Colors.Green)
        .setFooter({
          text: client.getUserData().footer,
          iconURL: client.getUserData().icon,
        }),
    ],
  });
});
