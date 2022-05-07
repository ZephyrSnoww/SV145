import { createEmbed, randomChoice } from '../helpers.js';
import { SlashCommandBuilder } from '@discordjs/builders';
import { Parser } from 'expr-eval';
import { errorTitles, successTitles } from '../data/randomMessages.js';

export const command = {
  data: new SlashCommandBuilder()
    .setName('math')
    .setDescription('Have me calculate some math!')
    .addStringOption(option => option
      .setName('equations')
      .setDescription('The equation(s) for me to calculate! (6x+1, 2y-3, etc.)')
      .setRequired(true))
    .addStringOption(option => option
      .setName('variables')
      .setDescription('The variable(s) for me to use as input! (x=1, y=2, etc.)')
      .setRequired(false)),

  async execute (interaction) {
    const equations = interaction.options.getString('equations');
    const variables = interaction.options.getString('variables') || '';

    const parser = new Parser();

    const splitEquations = equations.split(/, */);
    const splitVariables = variables.split(/, */);

    const parsedEquations = [];
    const parsedVariables = {};

    for (const equation of splitEquations) {
      try {
        parsedEquations.push(parser.parse(equation));
      } catch (e) {
        return interaction.reply({
          embeds: [
            createEmbed({
              title: randomChoice(errorTitles),
              description: 'If you\'re multiplying variables, you must do "2 * x", not "2x"!',
              author: interaction.user
            })
          ]
        });
      }
    }

    for (const variable of splitVariables) {
      const splitVariable = variable.split(/ *= */);
      parsedVariables[splitVariable[0]] = Number(splitVariable[1]);
    }

    const output = [];

    if (variables !== '') {
      for (const [variable, value] of Object.entries(parsedVariables)) {
        output.push(`${variable} = ${value}`);
      }
      output.push('');
    }

    for (const equation of parsedEquations) {
      try {
        output.push(`${equation} = **${equation.evaluate(parsedVariables)}**`);
      } catch (e) {
        output.push(`${equation} = **ERROR** *(${e.text})*`);
      }
    }

    interaction.reply({
      embeds: [
        createEmbed({
          title: randomChoice(successTitles),
          description: output.join('\n'),
          author: interaction.user
        })
      ]
    });

    console.log(`${interaction.user.username} did some math!`);
  }
};
