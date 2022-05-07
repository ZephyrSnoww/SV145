import { createEmbed, randomChoice } from '../helpers.js';
import { SlashCommandBuilder } from '@discordjs/builders';
import { successTitles } from '../data/randomMessages.js';

export const command = {
  data: new SlashCommandBuilder()
    .setName('who-is')
    .setDescription('Get information about a user!')
    .addUserOption(option => option
      .setName('user')
      .setDescription('The user to get information about!')
      .setRequired(true)),

  async execute (interaction) {
    const user = await interaction.options.getUser('user').fetch();

    interaction.reply({
      embeds: [
        createEmbed({
          title: randomChoice(successTitles),
          description: `\
            **Username:** ${user.tag}
            **ID:** ${user.id}
            **Created At:** ${user.createdAt.toString()}`,
          fields: [
            {
              name: 'Flags',
              value: `${user.flags.toArray().length > 0 ? user.flags.toArray() : 'No flags!'}`
            }
          ],
          thumbnail: user.avatarURL({
            format: 'png',
            size: 256,
            dynamic: true
          }),
          image: user.bannerURL({
            format: 'png',
            size: 512,
            dynamic: true
          }),
          author: interaction.user
        })
      ]
    });

    console.log(`${interaction.user.username} got information about ${user.username}!`);
  }
};
