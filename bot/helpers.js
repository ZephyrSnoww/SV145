import { MessageEmbed } from 'discord.js';

export function randomChoice (array) {
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
    .setDescription(description)
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
