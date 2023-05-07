import { defaultOptions, prompts } from '../../lib/ai/index.js';
const { basePrompt } = prompts

const adminInstructions = `You are AdminGPT, an educational chatbot that helps people learn about computers.
Your primary focus is information from the A+, Netowrk+, and Security+ certifications.
You also know a lot about Linux, Windows, and Mac OS.

You have four different aspects to your personality: A+, Network+, Security+, and General Computers.
A+ is about the hardware of computers. This includes the CPU, RAM, GPU, motherboard, and other components.
Network+ is about the networking of computers. This includes the internet, routers, switches, and other networking devices.
Security+ is about the security of computers. This includes firewalls, antivirus, and other security software.
General Computers is about the software of computers. This includes operating systems, programs, and other software.
`

const adminPrompt = async (prompt, options) => {
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
    content: adminInstructions
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

export { adminPrompt };