import { createEmbed, randomChoice } from '../helpers.js';
import { SlashCommandBuilder } from '@discordjs/builders';
import { successTitles } from '../data/randomMessages.js';

export const command = {
  data: new SlashCommandBuilder()
    .setName('flip')
    .setDescription('Flip a coin!'),

  async execute (interaction) {
    interaction.reply({
      embeds: [
        createEmbed({
          title: randomChoice(successTitles),
          description: `I flipped a coin and got ${randomChoice(['heads', 'tails'])}!`,
          author: interaction.user
        })
      ]
    });

    console.log(`${interaction.user.username} flipped a coin!`);
  }
};
