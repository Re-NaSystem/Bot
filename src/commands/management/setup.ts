import { ChannelType, Colors, EmbedBuilder, PermissionFlagsBits, PermissionsBitField } from 'discord.js';
import { Command } from '../../modules';
import { readFileSync } from "fs";

export default new Command({
  name: 'setup',
  description: 'setup minecraft channels',
  run: async ({ client, interaction }) => {
    if (interaction.user.id !== client.getUserData().userId) return interaction.reply(`${client.getUserData().usertag}のみ実行可能です`)

    const rule_msg = await readFileSync("./rule.txt", 'utf-8')
    const how_to_join_msg = await readFileSync("./how_to_join.txt", 'utf-8')
    const how_to_link_msg = await readFileSync("./how_to_link.txt", 'utf-8')
    const channel_description_msg = await readFileSync("./channel_description.txt", 'utf-8')

    await interaction.deferReply();
    if (!interaction.guild) return;

    await interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setTitle("チャンネルを作成中...")
          .setDescription('🔵 チャンネルの作成\n🔴 権限の設定\n🔴 各チャンネルへのメッセージの送信')
          .setColor(Colors.Green)
          .setFooter({
            text: client.getUserData().footer,
            iconURL: client.getUserData().icon,
          })
      ]
    });

    const parent = await interaction.guild?.channels.create({
      type: ChannelType.GuildCategory,
      name: "SERVER",
      permissionOverwrites: [
        {
          id: interaction.guild.id,
          deny: [
            PermissionsBitField.Flags.SendMessages
          ]
        }
      ],
    })

    const rule = await interaction.guild?.channels.create({
      type: ChannelType.GuildText,
      name: '📕｜ルール',
      parent: parent?.id
    })

    await interaction.guild?.channels.create({
      type: ChannelType.GuildAnnouncement,
      name: '✅｜バックアップ履歴',
      parent: parent?.id
    })

    const how_to_join = await interaction.guild?.channels.create({
      type: ChannelType.GuildText,
      name: '🔰｜参加方法',
      parent: parent?.id
    })

    const how_to_link = await interaction.guild?.channels.create({
      type: ChannelType.GuildText,
      name: '🔗｜リンク方法',
      parent: parent?.id
    })

    const channel_description = await interaction.guild?.channels.create({
      type: ChannelType.GuildText,
      name: '📕｜各チャンネルの説明',
      parent: parent?.id
    })

    await interaction.guild?.channels.create({
      type: ChannelType.GuildText,
      name: '🟢｜起動ログ',
      parent: parent?.id
    })
    
    const in_game_chat = await interaction.guild?.channels.create({
      type: ChannelType.GuildText,
      name: '🎮｜ゲーム内チャット',
      parent: parent?.id
    })

    const memo = await interaction.guild?.channels.create({
      type: ChannelType.GuildText,
      name: '📝｜メモ',
      parent: parent?.id
    })

    await interaction.editReply({
      embeds: [
        new EmbedBuilder()
          .setTitle("権限を設定中...")
          .setDescription('✅ チャンネルの作成\n🔵 権限の設定\n🔴 各チャンネルへのメッセージの送信')
          .setColor(Colors.Green)
          .setFooter({
            text: client.getUserData().footer,
            iconURL: client.getUserData().icon,
          })
      ]
    });

    await in_game_chat?.permissionOverwrites.set([
      {
        id: interaction.guild.id,
        allow: [
          PermissionsBitField.Flags.SendMessages
        ]
      }
    ]);

    await memo?.permissionOverwrites.set([
      {
        id: interaction.guild.id,
        allow: [
          PermissionsBitField.Flags.SendMessages
        ]
      }
    ])

    await interaction.editReply({
      embeds: [
        new EmbedBuilder()
          .setTitle("各チャンネルへメッセージを送信中...")
          .setDescription('✅ チャンネルの作成\n✅ 権限の設定\n🔵 各チャンネルへのメッセージの送信')
          .setColor(Colors.Green)
          .setFooter({
            text: client.getUserData().footer,
            iconURL: client.getUserData().icon,
          })
      ]
    });

    await rule.send(rule_msg)
    await how_to_join.send(how_to_join_msg)
    await how_to_link.send(how_to_link_msg)
    await channel_description.send(channel_description_msg)

    await interaction.editReply({
      embeds: [
        new EmbedBuilder()
          .setTitle("✅ セットアップが完了しました")
          .setDescription('✅ チャンネルの作成\n✅ 権限の設定\n✅ 各チャンネルへのメッセージの送信')
          .setColor(Colors.Green)
          .setFooter({
            text: client.getUserData().footer,
            iconURL: client.getUserData().icon,
          })
      ]
    });
  },
});