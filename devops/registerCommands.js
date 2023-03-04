import { REST, Routes } from 'discord.js';
import { TOKEN, CLIENT_ID } from './environmentVariables.js'
import { commands as _commands } from '../commands/index.js'

// we want to register the command definitions
const commands = _commands.map(command => command.definition)

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