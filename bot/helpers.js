import { MessageEmbed } from 'discord.js';

export function randomChoice (array, weights = undefined) {
  if (weights) {
    if (array.length !== weights.length) {
      throw new RangeError('Array and weights must be the same length!');
    }

    const tempArray = [];

    for (let i = 0; i < array.length; i++) {
      for (let o = 0; o < weights[i]; o++) {
        tempArray.push(array[i]);
      }
    }

    array = tempArray;
  }

  return array[Math.floor(Math.random() * array.length)];
}

export function createEmbed ({
  title,
  description,
  color = null,
  url = null,
  author = null,
  thumbnail = null,
  fields = [],
  image = null,
  footer = null,
  timestamp = true
}) {
  if (!color) {
    color = '00FF00';
  }

  const embed = new MessageEmbed()
    .setTitle(title)
    .setDescription(description.replace(/(\n([ ]{2,}))/gm, '\n'))
    .setColor(color)
    .setURL(url)
    .setThumbnail(thumbnail)
    .setImage(image);

  if (timestamp) {
    embed.setTimestamp();
  }

  if (author) {
    embed.setAuthor(author.username, author.avatarURL());
  }

  if (fields.length !== 0) {
    for (let i = 0; i < fields.length; i++) {
      embed.addField(
        fields[i].name,
        fields[i].value,
        fields[i].inline ? fields[i].inline : false
      );
    }
  }

  if (footer) {
    embed.setFooter(footer.text, footer.image);
  }

  return embed;
}
