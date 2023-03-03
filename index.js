// Load env variables
import * as dotenv from 'dotenv' 
dotenv.config()

// Require the necessary discord.js classes
import { Client, Events, Collection, GatewayIntentBits } from 'discord.js';
import { simplePrompt, lawOfOnePrompt } from './lib/ai/src/connect/prompts.js'

const token = process.env.DISCORD_BOT_TOKEN || '';

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
client.commands = new Collection()

// When the client is ready, run this code (only once)
// We use 'c' for the event parameter to keep it separate from the already defined 'client'
client.once(Events.ClientReady, c => {
	console.log(`Ready! Logged in as ${c.user.tag}`);
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === 'ai') {
    const input = interaction.options.getString('input')
    if(!input) return
    await interaction.reply(`Prompt: ${input}\nResponse: ${await simplePrompt(input)}`);
  }

  if (interaction.commandName === 'ra') {
    const input = interaction.options.getString('input')
    if(!input) return
    await interaction.reply(`Prompt: ${input}\n${await lawOfOnePrompt(input)}`);
  }
});

// Log in to Discord with your client's token
client.login(token);