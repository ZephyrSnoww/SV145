import { createEmbed, randomChoice } from '../helpers.js';
import { SlashCommandBuilder } from '@discordjs/builders';
import { generateData } from '../data/songData.js';
import { successTitles } from '../data/randomMessages.js';

export const command = {
  data: new SlashCommandBuilder()
    .setName('song-prompt')
    .setDescription('Generate a prompt for a song!')
    .addIntegerOption(option => option
      .setName('min-bpm')
      .setDescription('The minimum BPM possible! (default 30)')
      .setRequired(false))
    .addIntegerOption(option => option
      .setName('max-bpm')
      .setDescription('The maximum BPM possible! (default 512)')
      .setRequired(false))
    .addBooleanOption(option => option
      .setName('include-notes')
      .setDescription('Whether to include a list of notes in the chosen scale! (defaults to true)')
      .setRequired(false))
    .addBooleanOption(option => option
      .setName('include-time-signature')
      .setDescription('Whether to include a time signature! (defaults to true)')
      .setRequired(false))
    .addStringOption(option => option
      .setName('scale-preference')
      .setDescription('Whether you prefer a major or minor scale! (defaults to no preference)')
      .setRequired(false)
      .addChoice('Major', 'major')
      .addChoice('Minor', 'minor')),

  async execute (interaction) {
    const minBPM = interaction.options.getInteger('min-bpm') || 30;
    const maxBPM = interaction.options.getInteger('max-bpm') || 512;
    const preference = interaction.options.getString('scale-preference') || null;

    let includeNotes = interaction.options.getBoolean('include-notes');
    let includeTimeSignature = interaction.options.getBoolean('include-time-signature');

    if (includeNotes === null) {
      includeNotes = true;
    }

    if (includeTimeSignature === null) {
      includeTimeSignature = true;
    }

    const songData = generateData(minBPM, maxBPM, preference);

    const output = [
      `**BPM:** ${songData.bpm}`,
      `**Key:** ${songData.key}`,
      `**Scale:** ${songData.scale}`
    ];

    if (includeNotes) {
      output.push(`**Notes:** ${songData.notes.join(' ')}`);
    }

    if (includeTimeSignature) {
      output.push(`**Time Signature:** ${songData.timeSignature}`);
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
    console.log(`${interaction.user.username} generated song data!`);
  }
};
