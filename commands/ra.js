import { SlashCommandBuilder } from 'discord.js';
import { lawOfOnePrompt } from '../lib/ai/src/connect/prompts/index.js';

const ra = {
  definition:
    new SlashCommandBuilder()
    .setName('ra')
    .setDescription('Short Ra Query')
    .addStringOption(option =>
      option.setName('input')
        .setDescription('The input to ask Ra')),
  action: async (interaction) => {
    const input = interaction.options.getString('input', { discord: true })
    if(!input) return
    await interaction.reply(`Prompt: ${input}`);
    const response = await lawOfOnePrompt(input)
    await interaction.editReply(`Prompt: ${input}\n${response}`);
  }
}

export { ra }