import { SlashCommandBuilder } from 'discord.js';
import { sethPrompt } from './customPrompts/sethPrompt.js'

const seth = {
  definition:
    new SlashCommandBuilder()
    .setName('seth')
    .setDescription('Short Seth Query')
    .addStringOption(option =>
      option.setName('input')
        .setDescription('The input to ask Seth')),
  action: async (interaction) => {
    const input = interaction.options.getString('input', { discord: true })
    if(!input) return
    await interaction.reply(`Prompt: ${input}`);
    const response = await sethPrompt(input)
    await interaction.editReply(`Prompt: ${input}\n${response}`);
  }
}

export { seth }