import { createEmbed, randomChoice } from '../helpers.js';
import { SlashCommandBuilder } from '@discordjs/builders';
import { successTitles } from '../data/randomMessages.js';
import axios from 'axios';

export const command = {
  data: new SlashCommandBuilder()
    .setName('game-deals')
    .setDescription('Get game deals!'),

  async execute (interaction) {
    axios.get('https://www.cheapshark.com/api/1.0/deals?sortBy=Deal%20Rating').then((resp) => {
      const data = resp.body;
      const bestGame = data[0];

      interaction.reply({
        embeds: [
          createEmbed({
            title: randomChoice(successTitles) + ' Here\'s the Best Rated Game Deal!',
            description: `__**${bestGame.title}**__\n\nSelling for: ${}`,
            thumbnail: bestGame.thumb,
            author: interaction.user
          })
        ]
      });

      console.log(`${interaction.user.username} got game deals!`);
    });
  }
};
