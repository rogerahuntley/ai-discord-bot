import { REST, Routes, SlashCommandBuilder } from 'discord.js';

import * as dotenv from 'dotenv' 
dotenv.config()

const TOKEN = process.env.DISCORD_BOT_TOKEN || '';
const CLIENT_ID = process.env.DISCORD_CLIENT_ID || '';

const commands = [
  new SlashCommandBuilder()
    .setName('ai')
    .setDescription('Short AI Query')
    .addStringOption(option =>
      option.setName('input')
        .setDescription('The input to the AI')),

new SlashCommandBuilder()
  .setName('ra')
  .setDescription('Short Ra Query')
  .addStringOption(option =>
    option.setName('input')
      .setDescription('The input to ask Ra'))
].map(command => command.toJSON());

const rest = new REST({ version: '10' }).setToken(TOKEN);

(async () => {
  try {
    console.log('Started refreshing application (/) commands.');

    await rest.put(Routes.applicationCommands(CLIENT_ID), { body: commands });

    console.log('Successfully reloaded application (/) commands.');
  } catch (error) {
    console.error(error);
  }
})();