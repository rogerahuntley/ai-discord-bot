// Import the necessary discord.js classes
import { Client, Events, Collection, GatewayIntentBits } from 'discord.js';
import { commands } from './commands/index.js'
import { dbClose } from './storage/database.js';

import { TOKEN } from './devops/environmentVariables.js';

// load from db / set up subscriptions
import { setUpAllSubscriptions } from './storage/subscribe.js';

// Create a new client instance
const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildMembers,
	],
});
client.commands = new Collection()

// When the client is ready, run this code (only once)
// We use 'c' for the event parameter to keep it separate from the already defined 'client'
client.once(Events.ClientReady, async c => {
	console.log(`Ready! Logged in as ${c.user.tag}`);
  await setUpAllSubscriptions(c);
  console.log("Subscriptions set up")
});

const commandsByName = {}

commands.forEach(command => {
  commandsByName[command.name] = command
})

client.on('interactionCreate', async interaction => {
  console.log("interaction recevied")
  if (!interaction.isChatInputCommand()) return;

  const command = commandsByName[interaction.commandName]
  if(!command) return
  console.log("running command: ", command.name)
  command.action(interaction)
});

client.on('rateLimit', (rateLimitInfo) => {
  console.log(`Rate limited: ${rateLimitInfo}`);
});

client.on('shutdown', async () => {
  await dbClose();
  client.destroy();
});

// Log in to Discord with your client's token
client.login(TOKEN);