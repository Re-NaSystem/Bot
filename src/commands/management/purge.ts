import { ApplicationCommandOptionType, ChannelType, Colors, EmbedBuilder, GuildMember, PermissionsBitField } from 'discord.js';
import { Command } from '../../modules';

export default new Command({
  name: 'purge',
  description: 'Purge the specified number of messages.',
  options: [
    {
      name: 'amount',
      description: 'Number of messages to delete(Default: 10).',
      maxValue: 100,
      min_value: 1,
      type: ApplicationCommandOptionType.Number,
      required: false
    }
  ],
  run: async ({ client, interaction }) => {
    await interaction.deferReply()

    const member: GuildMember = interaction.guild?.members.cache.get(interaction.user.id) as GuildMember

    if (!member || interaction.channel?.type !== ChannelType.GuildText) {
      return await interaction.followUp({
        embeds: [
          new EmbedBuilder()
          .setTitle('An unexpected error has occurred.')
          .setDescription(`If it is not corrected, please visit our support server.`)
          .setColor(Colors.Red)
          .setFooter({
            text: client.getUserData().footer,
            iconURL: client.getUserData().icon,
          })
        ]
      })
    }

    if (!member.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
      return await interaction.followUp({
        embeds: [
          new EmbedBuilder()
          .setTitle('Missing permissions.')
          .setDescription('You must have `Manage Messages` permission to run this command.')
          .setColor(Colors.Red)
          .setFooter({
            text: client.getUserData().footer,
            iconURL: client.getUserData().icon,
          })
        ]
      })
    }
    
    await interaction.channel.bulkDelete(interaction.options.getNumber("amount") || 10);

    await interaction.followUp({
      embeds: [
        new EmbedBuilder()
        .setTitle('Success!')
        .setDescription(`:white_check_mark: Deleted ${interaction.options.getNumber("amount") || 10} messages.`)
        .setColor(Colors.Green)
        .setFooter({
          text: client.getUserData().footer,
          iconURL: client.getUserData().icon,
        })
      ]
    })

  },
});