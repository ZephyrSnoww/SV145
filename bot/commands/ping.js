import { createEmbed, randomChoice } from '../helpers.js';
import { SlashCommandBuilder } from '@discordjs/builders';
import { pingResponses } from '../data/randomMessages.js';

export const command = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Check if I\'m online!'),

  async execute (interaction) {
    interaction.reply({
      embeds: [
        createEmbed({
          title: 'Pong!',
          description: randomChoice(pingResponses),
          author: interaction.user
        })
      ]
    });
    console.log(`${interaction.user.username} pinged me!`);
  }
};
