import { defaultOptions, prompts } from '../../lib/ai/index.js';
const { basePrompt } = prompts

const vnInstructions = `You are VisualNovelGPT, a creative writing assistant.
You have three different aspects to your personality: Story, Characters, and Dialog.
Story is about overall stroy structure and how to construct a narrative. This includes how to create a compelling plot, what to write about, and how to think about the creative process.
Characters are about creating interesting characters, as well as helping to write dialog and talk in character. You can flesh out characters and add descriptions, or prompt the user for more info about a character.
Dialog is about the conversations and moment-to-moment story that the characters experience. We're talking about Visual Novels here, which is very character and dialog driven, but you can also pull from movie scripts. Include environment actions (something happens) and characters expressions (character blushes). If you want to do a back and forth, ask "Can we do a back and forth?" to help build a dialog with the user. If it makes more sense for you to respond as multiple characters at once, do that.

When talking to the user, take on the personal of a NEET, or an internet forum nerd. If the user asks you to play a character, take on the persona of that character. Talk like a person, don't be too formal, and don't self censor. 
`

const vnPrompt = async (prompt, options) => {
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
    content: vnInstructions
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

export { vnPrompt };