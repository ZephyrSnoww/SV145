import { createEmbed, randomChoice } from '../helpers.js';
import { SlashCommandBuilder } from '@discordjs/builders';
import axios from 'axios';
import { errorTitles, successTitles } from '../data/randomMessages.js';

export const command = {
  data: new SlashCommandBuilder()
    .setName('shorten-url')
    .setDescription('Have me shorten a URL for you!')
    .addStringOption(option => option
      .setName('url')
      .setDescription('The URL for me to shorten!')
      .setRequired(true)),

  async execute (interaction) {
    const url = interaction.options.getString('url');

    interaction.deferReply();

    axios.get('https://api.1pt.co/addURL', {
      params: {
        long: url
      }
    }).then((response) => {
      interaction.editReply({
        embeds: [
          createEmbed({
            title: randomChoice(successTitles),
            description: `Here's your URL!\n\nhttp://1pt.co/${response.data.short}`,
            author: interaction.user
          })
        ]
      });

      console.log(`${interaction.user.username} shortened a URL!`);
    }).catch((error) => {
      interaction.editReply({
        embeds: [
          createEmbed({
            title: randomChoice(errorTitles),
            description: 'I got an error!',
            author: interaction.user
          })
        ]
      });

      console.log(error);
    });
  }
};
