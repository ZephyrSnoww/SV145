import { createEmbed, randomChoice } from '../helpers.js';
import { SlashCommandBuilder } from '@discordjs/builders';
import { errorTitles } from '../data/randomMessages.js';

export const command = {
  data: new SlashCommandBuilder()
    .setName('choose')
    .setDescription('I\'ll make a choice for you!')
    .addStringOption((option) => option
      .setName('choices')
      .setDescription('The choices to choose from, seperated by a comma.')
      .setRequired(true)),

  async execute (interaction) {
    const choices = interaction.options.getString('choices');

    const splitChoices = choices.split(/,\s*/gm);

    if (splitChoices.length === 1) {
      return interaction.reply({
        embeds: [
          createEmbed({
            title: randomChoice(errorTitles),
            description: 'You must provide at least two options!',
            author: interaction.user
          })
        ],
        ephemeral: true
      });
    }

    const choice = randomChoice(splitChoices);

    interaction.reply({
      embeds: [
        createEmbed({
          title: choice,
          description: `I choose "${choice}"!`,
          author: interaction.user,
          fields: [
            {
              name: 'Choices You Gave',
              value: splitChoices.join('\n')
            }
          ]
        })
      ]
    });
    console.log(`${interaction.user.username} made a choice!`);
  }
};
