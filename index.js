// Load env variables
import * as dotenv from 'dotenv' 
dotenv.config()

// Require the necessary discord.js classes
import { Client, Events, Collection, GatewayIntentBits } from 'discord.js';
import { simplePrompt, lawOfOnePrompt } from './lib/ai/src/connect/prompts/index.js'

const TOKEN = process.env.DISCORD_BOT_TOKEN || '';
const DEV = process.env.NODE_ENV != 'production'

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
client.commands = new Collection()

// When the client is ready, run this code (only once)
// We use 'c' for the event parameter to keep it separate from the already defined 'client'
client.once(Events.ClientReady, c => {
	console.log(`Ready! Logged in as ${c.user.tag}`);
});

const commands = [{
  name: 'ai',
  action: async (interaction) => {
    const input = interaction.options.getString('input', { discord: true })
    if(!input) return
    await interaction.reply(`Prompt: ${input}`);
    const response = await simplePrompt(input)
    await interaction.editReply(`Prompt: ${input}\nResponse: ${response}`);
  }
}, 
{
  name: 'ra',
  action: async (interaction) => {
    const input = interaction.options.getString('input', { discord: true })
    if(!input) return
    await interaction.reply(`Prompt: ${input}`);
    const response = await lawOfOnePrompt(input)
    await interaction.editReply(`Prompt: ${input}\n${response}`);
  }
}]

if(DEV){
  commands.forEach(command => {
    command.name = `dev-${command.name}`
  })
}

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