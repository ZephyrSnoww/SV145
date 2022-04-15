import { Client, Intents, Collection, Permissions } from 'discord.js';
import { Routes } from 'discord-api-types/v9';
import { REST } from '@discordjs/rest';
import { polarity } from 'polarity';
import haiku from 'haiku-detect';
import dotenv from 'dotenv';
import fs from 'fs';

// Register .env file
dotenv.config();

// Grab environment variables
const TOKEN = process.env.TOKEN;

// Make an array of all command file names
const commandFiles = fs.readdirSync('./bot/commands').filter(file => file.endsWith('.js'));

// Create a new client instance
const client = new Client({
  intents: Object.values(Intents.FLAGS)
});

// Make a new commands collection
const commands = [];
client.commands = new Collection();

// Iterate through command filenames
// Require them, add them to the collection
for (const file of commandFiles) {
  import(`./commands/${file}`).then((commandModule) => {
    const command = commandModule.command;
    client.commands.set(command.data.name, command);
    commands.push(command.data.toJSON());
  });
}

// When the client is first ready
client.once('ready', () => {
  // Say so
  console.log('Ready!');
  const clientID = client.user.id;
  const rest = new REST({ version: '9' }).setToken(TOKEN);

  const guildIDs = [];

  for (const guild of client.guilds.cache) {
    guildIDs.push(guild[0]);
  }

  // Register commands
  (async () => {
    try {
      for (const ID of guildIDs) {
        await rest.put(
          Routes.applicationGuildCommands(clientID, ID), {
            body: commands
          }
        );
        console.log(`Registered commands to ${ID}`);
      }
      console.log('Successfully registered application commands!');
    } catch (error) {
      if (error) console.error(error);
    }
  })();
});

// When the client recieves an interaction
client.on('interactionCreate', async (interaction) => {
  // Only listen for commands
  if (!interaction.isCommand()) return;

  const command = client.commands.get(interaction.commandName);

  if (!command) return;

  if (command.modOnly) {
    if (!interaction.memberPermissions.has(Permissions.FLAGS.MANAGE_GUILD)) {
      return await interaction.reply({
        content: 'You don\'t have permission to do that command!',
        ephemeral: true
      });
    }
  }

  try {
    await command.execute(interaction);
  } catch (error) {
    if (error) { console.error(error); }
    await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
  }
});

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;
  if (message.content === '') return;

  let splitMessage = message.content.replace(/\*/, '\\*').split('\n');

  if (haiku.detect(message.content)) {
    const formattedHaiku = haiku.format(message.content.replace(/\*/, '\\*').replace(/\n/, ''));

    message.reply(`*${formattedHaiku.join('\n')}*`);
  } else {
    for (const line of splitMessage) {
      if (haiku.detect(line)) {
        const formattedHaiku = haiku.format(line);

        message.reply(`*${formattedHaiku.join('\n')}*`);
      }
    }
  }

  splitMessage = message.content.split(/\s/);
  const messagePolarity = polarity(splitMessage);

  if (messagePolarity.polarity < -10) {
    message.reply('Wow! That message was really negative! Congrats.');
  } else if (messagePolarity.polarity > 10) {
    message.reply('Wow! That message was really positive! Congrats.');
  } else if (messagePolarity.polarity === 0 && (messagePolarity.positivity + messagePolarity.negativity) > 20) {
    message.reply('Wow! That message was very positive *and* negative! Make up your mind, cmon now.');
  }
});

// When someone joins the server
client.on('guildMemberAdd', async (member) => {
  console.log(`${member.user.username} joined!`);
  // await sendWelcomeImage(member);
});

// Login using the given token
client.login(TOKEN);
