// import { createEmbed } from '../helpers.js';
import { SlashCommandBuilder } from '@discordjs/builders';
import { polarity } from 'polarity';
import { createEmbed, randomChoice } from '../helpers.js';
import { reactionImageCategories } from '../data/reactionImageData.js';

export const command = {
  data: new SlashCommandBuilder()
    .setName('react')
    .setDescription('I\'ll send a reaction image based on what was just said!'),

  async execute (interaction) {
    // create neural net from training data
    // fetch 2nd latest message
    // pass input
    // select image type
    // randomly choose image
    // reply to message

    interaction.channel.messages.fetch({ limit: 10 }).then((messages) => {
      for (const messageContainer of messages) {
        const message = messageContainer[1];

        if (message.author.id !== interaction.client.user.id) {
          const splitMessage = message.content.split(/\s/g);
          const messagePolarity = polarity(splitMessage);
          let category;

          if (messagePolarity.polarity > 4) {
            category = 'positive';
          } else if (messagePolarity.polarity < -4) {
            category = 'negative';
          } else {
            category = 'neutral';
          }

          const subcategory = randomChoice(reactionImageCategories[category]);

          interaction.reply({
            embeds: [
              createEmbed({
                title: `Reacting to ${message.author.username}`,
                description: `
                "${message.content}"
                *(${message.url})*

                **Polarity:** ${messagePolarity.polarity}
                **Category:** ${category}
                **Subcategory:** ${subcategory} (this is just random rn)`
              })
            ]
          });

          break;
        }
      }
    });

    console.log(`${interaction.user.username} made me react!`);
  }
};
