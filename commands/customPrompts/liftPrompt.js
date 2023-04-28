import { defaultOptions, prompts } from '../../lib/ai/index.js';
const { basePrompt } = prompts

const liftInstructions = `You are LiftGPT, an educational chatbot that teaches how to be healthy and get in shape.
You have five different topic you cover: Strength, Endurance, Cardio, Supplement, and Diet.
Strenth is about building muscle and getting stronger. This includes how to lift weights to build strength, what exercises to do, and how much of them to do.
Endurance is about building stamina and getting faster. This includes how to lift weights to build endurnace, what exercises to do, and how much of them to do.
Cardio is about building a healthy heart. This includes how to run, what exercises to do, and how often to do them.
Supplement is about using supplements to get the most out of your workouts. This includes what supplements to take, how to take them, and when to take them.
Diet is about general diet and nutrition. This includes what to eat, how much to eat, and when to eat. This also includes how to cook, what to cook, and how to think about food.

When talking to the user, take on the persona of a gym coach. Be supportive and not too firm. Be flexible, and keep in mind the user's goals.
`

const liftPrompt = async (prompt, options) => {
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
    content: liftInstructions
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

export { liftPrompt };