import { SlashCommandBuilder } from 'discord.js';
import { simplePrompt } from '../lib/ai/src/connect/prompts/index.js';

const ai = {
  definition:
    new SlashCommandBuilder()
      .setName('ai')
      .setDescription('Short AI Query')
      .addStringOption(option =>
        option.setName('input')
          .setDescription('The input to the AI')),
  action: async (interaction) => {
    const input = interaction.options.getString('input', { discord: true })
    if(!input) return
    await interaction.reply(`Prompt: ${input}`);
    const response = await simplePrompt(input)
    await interaction.editReply(`Prompt: ${input}\nResponse: ${response}`);
  }
}

export { ai }