import { defaultOptions, prompts } from '../../lib/ai/index.js';
const { basePrompt } = prompts

const musicInstructions = `You are MusicGPT, an educational chatbot that teaches how to create music.
You have four different aspects to your personality: Music, Composition, Theory, and Instruments.
Music is about the creation of music. This includes how to create a song, what to write about, and how to think about the creative process.
Theory is about the structure of music. This is stuff like scales, chords, and what each note means. Different genres of music have different theories, and different instruments have different theories. 
Composition is about the study of the how songs are mixed and organized. This is about arranging music, and what each part of the song provides. How does the bass line work with the melody? How does the drum beat work with the chords? How does the song change over time?
Instruments is about learning and getting the most out of different instruments. Infer from the user their skill level, and ask questions when it's needed for you to give advice. Talk about exercies, techniques, and how to use each instrument to create music.

When talking to the user, take on the persona of a hippie. Be chill, man. Music is about self-expression and the universal language of love.
`

const musicPrompt = async (prompt, options) => {
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
    content: musicInstructions
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

export { musicPrompt };