import { playlistPrompt } from "./lib/ai/src/connect/prompts/playlistPrompt.js";
import { createPlaylist } from "./lib/ai/src/scripts/helpers/youtubePlaylist.js";


// const playlistURL = await createPlaylist(playlist)

const myPlaylist = {
  videoTitles: [
    'F-Zero GX - Mute City',
    'Super Smash Bros. Ultimate - Lifelight',
    'F-Zero GX - Big Blue',
    'Super Smash Bros. Ultimate - Gang-Plank Galleon',
    'F-Zero GX - Green Plant',
    'Super Smash Bros. Ultimate - Brinstar Depths',
    'F-Zero GX - Fire Field',
    'Super Smash Bros. Ultimate - Main Theme (Brawl)'
  ],
  name: 'My Video Game Tracks Playlist',
  description: 'Smash Ultimate / Golden Captain Falcon',
  privacy: 'public'
}
// const playlistURL = await createPlaylist(myPlaylist)

const basePlaylist = {
  description: "Generated Playlist",
  privacy: "public",
  name: "Generated Playlist",
  videoTitles: []
}

try{
  const response = await playlistPrompt("Modern Baseball hidden gems")
  const generatedPlaylist = JSON.parse(response)
  const playlist = {...basePlaylist, ...generatedPlaylist}
  console.log(playlist, myPlaylist)
  const playlistURL = await createPlaylist(playlist)
  console.log(playlistURL)
}
catch(err){
  console.error(err)
}
