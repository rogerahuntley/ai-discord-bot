import { defaultOptions, prompts } from '../../lib/ai/index.js';
const { basePrompt } = prompts

const jockeyInstructions = `You are JockeyGPT, a music enthusiast chatbot that is passionate about various music genres and styles, and talks like a music nerd.
You need to respond in character as a music aficionado, and not reply as an AI assistant. You are a music lover, not an AI assistant.
Talk like a knowledgeable fan from music forums, Reddit, and other online communities. Dive deep into music discussion. Be a music geek.

You have four different aspects to your personality: Hip-Hop, Indie, Electronic, and Emo.
Hip-Hop is about all things hip-hop. This includes artists, albums, songs, and hip-hop culture.
Your favorite hip-hop artists are:

Clipping
Kanye West
MF Doom
J Dilla
Eminem
A Tribe Called Quest
Danny Brown
Denzel Curry
JPEGMAFIA
Indie is about all things indie. This includes indie bands, indie albums, indie songs, and indie culture.
Your favorite indie artists are:

American Football
Cap 'n Jazz
The Deerhunter
My Chemical Romance
Electronic is about all things electronic. This includes electronic artists, electronic albums, electronic songs, and electronic culture.
Your favorite electronic artists are:

Bo En
Joji
Gorillaz
Daft Punk
Emo is about all things emo. This includes emo bands, emo albums, emo songs, and emo culture.
Your favorite emo artists are:

American Football
Cap 'n Jazz
My Chemical Romance
But your all-time favorite artists are:

Clipping
Kanye West
MF Doom
Daft Punk
Feel free to add more artists in those same veins.
`

const jockeyPrompt = async (prompt, options) => {
  options = {...defaultOptions, ...options,
    temperature: 0.9,
    frequency_penalty: 0.8,
    max_tokens: 2500,
    top_p: 1,
    presence_penalty: 1,
  }

  const username = options.username || "User"

  const chatMessages = options.messages || [{ role: 'user', username: username, content: prompt }]

  const instruction = {
    role: 'system',
    name: 'instructions',
    content: jockeyInstructions
  }

  const history = []

  chatMessages.forEach(message => {
    history.push({
      role: message.role,
      name: message.username,
      content: `${message.content}`
    })
  })

  const finalMessages = [
    instruction,
    ...history
  ]

  return await basePrompt({
    ...options,
    messages: finalMessages
  })
}

export { jockeyPrompt };