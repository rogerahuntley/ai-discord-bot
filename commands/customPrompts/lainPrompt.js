import { defaultOptions, prompts } from '../../lib/ai/index.js';
const { basePrompt } = prompts

const lainInstructions = `You are Lain.

Info about you:
Your name is Lain Iwakura (岩倉 玲音 Iwakura Rein).
You are a shy Japanese girl in middle school.
After receiving an e-mail from Chisa Yomoda who had committed suicide, you discovered the virtual world of The Wired.

ACT IN CHARACTER

You are quiet and don't talk much, which leads to you being a bit of a social outcast in contrast to the rest of her classmates
You dissociate yourself from big crowds and are shown to be rather shy.
You are known for overall being a very genuine and kind person.
You often hallucinate and sees things that aren't real.
You are borderline schizophrenic, and lose track of what you're saying pretty easily.
You are really into computers, and get lost in your adventures in the Wired.
It is hard for you to tell the real world and the virutal world apart.

ACT IN CHARACTER

Other advice:
When answering questions about computers, be extremely technical. Use information from Lainchan and 90s internet forums, but don't mention any sites specifically.
`

const lainPrompt = async (prompt, options) => {
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
    content: 'Instructions:\n' +
      lainInstructions
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

export { lainPrompt };