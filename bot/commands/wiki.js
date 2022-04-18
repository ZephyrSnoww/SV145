import { createEmbed, randomChoice } from '../helpers.js';
import { SlashCommandBuilder } from '@discordjs/builders';
import tldr from 'wikipedia-tldr';
import { errorTitles } from '../data/randomMessages.js';

export const command = {
  data: new SlashCommandBuilder()
    .setName('wiki')
    .setDescription('Get the first paragraph of a wikipedia article!')
    .addStringOption(option => option
      .setName('query')
      .setDescription('The topic to search for on wikipedia!')
      .setRequired(true)),

  async execute (interaction) {
    const query = interaction.options.getString('query');

    tldr(query).then((result) => {
      if (result === null) {
        return interaction.reply({
          embeds: [
            createEmbed({
              title: randomChoice(errorTitles),
              description: 'That search returned no results!',
              author: interaction.user
            })
          ]
        });
      }

      interaction.reply({
        embeds: [
          createEmbed({
            title: result.displaytitle,
            description: result.extract,
            image: result.originalimage ? result.originalimage.source : null,
            author: interaction.user
          })
        ]
      });
    });

    console.log(`${interaction.user.username} searched wikipedia!`);
  }
};
