import { createEmbed, randomChoice } from '../helpers.js';
import { SlashCommandBuilder } from '@discordjs/builders';
import axios from 'axios';
import { errorTitles, successTitles } from '../data/randomMessages.js';

export const command = {
  data: new SlashCommandBuilder()
    .setName('get-skin')
    .setDescription('Have me fetch a users minecraft skin!')
    .addStringOption(option => option
      .setName('username')
      .setDescription('The username of the user to fetch!')
      .setRequired(true)),

  async execute (interaction) {
    const username = interaction.options.getString('username');

    interaction.deferReply();

    axios.get('https://minecraftuuid.com/', {
      params: {
        search: username
      }
    }).then((response) => {
      interaction.editReply({
        embeds: [
          createEmbed({
            title: randomChoice(successTitles),
            description: `Here's ${username}'s skin!`,
            author: interaction.user,
            thumbnail: `https://crafatar.com/renders/body/${response.data.match(/value="(.+)"\s+placeholder="User UUID"/)[1]}`,
            image: `https://crafatar.com/renders/body/${response.data.match(/value="(.+)"\s+placeholder="User UUID"/)[1]}?scale=10&size=512&overlay`
          })
        ]
      });

      console.log(`${interaction.user.username} got a Minecraft skin!`);
    }).catch((error) => {
      interaction.editReply({
        embeds: [
          createEmbed({
            title: randomChoice(errorTitles),
            description: 'I couldn\'t find that user!',
            author: interaction.user
          })
        ]
      });

      console.log(error);
    });
  }
};
