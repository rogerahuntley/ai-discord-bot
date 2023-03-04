// Import the necessary discord.js classes
import { Client, Events, Collection, GatewayIntentBits } from 'discord.js';
import { commands } from './commands/index.js'

import { TOKEN } from './devops/environmentVariables.js';

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
client.commands = new Collection()

// When the client is ready, run this code (only once)
// We use 'c' for the event parameter to keep it separate from the already defined 'client'
client.once(Events.ClientReady, c => {
	console.log(`Ready! Logged in as ${c.user.tag}`);
});

const commandsByName = {}

commands.forEach(command => {
  commandsByName[command.name] = command
})

client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const command = commandsByName[interaction.commandName]
  if(!command) return
  command.action(interaction)
});

// Log in to Discord with your client's token
client.login(TOKEN);