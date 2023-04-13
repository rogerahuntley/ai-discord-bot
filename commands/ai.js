import { SlashCommandBuilder } from 'discord.js';
import { prompts } from '../lib/ai/index.js';
import { createThread, subscribeToThread } from '../storage/thread.js'
const { simplePrompt } = prompts

const threadResponse = async (input, thread) => {
  const messages = await (await thread.messages.fetch({ limit: 20 }))
  .reverse()
  .map(message => { return {  
    id: message.id,
    isBot: message.author.id == thread.client.user.id,
    name: message.author.username,
    content: message.content
  } })
  .map(message =>
    { return {
      role: message.isBot ? 'assistant' : 'user',
      name: message.isBot ? 'assistant' : message.name,
      content: message.content
    }})
  .filter(message => typeof message.content === 'string')
  const response = await simplePrompt(input, { thread: thread.name, messages, username: messages.at(-1).name, discord: true })
  return response
}

const ai = {
  disabled: false,
  definition:
    new SlashCommandBuilder()
      .setName('ai')
      .setDescription('Short AI Query')
      .addStringOption(option =>
        option.setName('input')
          .setDescription('The input to the AI'))
      .addStringOption(option =>
        option.setName('thread')
          .setDescription('Start a thread with AI')),
    action: async (interaction) => {
      const input = interaction.options.getString('input')
      const thread_input = interaction.options.getString('thread')
      if(input){
        await interaction.reply(`Prompt: ${input}`);
        const response = await simplePrompt(input, { username: interaction.user.username, discord: true })
        await interaction.editReply(`Prompt: ${input}\n${response}`);
  
      } else if (thread_input) {
        const threadManager = interaction.channel.threads;
        await interaction.reply(`Creating thread: ${thread_input}`)
  
        // create the thread
        threadManager.create({
          name: `AI Thread: ${thread_input}`,
          autoArchiveDuration: 60,
          reason: 'Thread created by bot'
        }).then(async thread => {
          
          // code to save information about the thread server-side
          createThread(thread, 'ai')
          interaction.editReply("Thread created!")
  
          // respond in the thread
          const response = await simplePrompt(thread_input, { username: interaction.user.username, discord: true })
          thread.send(response)
  
          subscribeToThread(thread, threadResponse)
        });
      }
    },
  threadType: 'ai',
  threadResponse
}

export { ai }