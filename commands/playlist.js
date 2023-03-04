import { SlashCommandBuilder } from 'discord.js';
import { playlistPrompt } from '../lib/ai/src/connect/prompts/playlistPrompt.js'
import { createPlaylist } from '../lib/ai/src/scripts/helpers/youtubePlaylist.js';

const playlist = {
  disabled: true,
  definition:
    new SlashCommandBuilder()
    .setName('playlist')
    .setDescription('Short Playlist Query')
    .addStringOption(option =>
      option.setName('input')
        .setDescription('Describe the kind of playlist you want')),
  action: async (interaction) => {
    const input = interaction.options.getString('input', { discord: true })
    if(!input) return
    await interaction.reply(`Prompt: ${input}`);

    const basePlaylist = {
      description: input,
      privacy: "public",
      name: "Generated Playlist",
      videoTitles: []
    }

    const generatedPlaylist = playlistPrompt(input)
    const playlist = {...basePlaylist, ...generatedPlaylist}
    await interaction.editReply(`Prompt: ${input}\nGenerating Playlist: ${playlist.name}`);
    const playlistURL = await createPlaylist(playlist)
    await interaction.editReply(`Prompt: ${input}\nPlaylist URL: ${playlistURL}`);
  }
}

export { playlist }