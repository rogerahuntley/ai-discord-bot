import { SlashCommandBuilder } from 'discord.js';
import { sethPrompt } from './customPrompts/sethPrompt.js'
import { createThread, subscribeToThread } from '../storage/thread.js'

const threadResponse = async (input, thread) => {
  const messages = await (await thread.messages.fetch({ limit: 20 }))
  .reverse()
  .map(message => { return {  
    id: message.id,
    isBot: message.author.id == thread.client.user.id,
    username: message.author.username,
    content: message.content
  } })
  .map(message =>
    { return {
      role: message.isBot ? 'assistant' : 'user',
      username: message.isBot ? 'Seth' : message.username,
      content: message.content
    }})
  .filter(message => typeof message.content === 'string')
  const response = await sethPrompt(input, { thread: thread.name, messages })
  return response
}

const seth = {
  disabled: true,
  definition:
    new SlashCommandBuilder()
    .setName('seth')
    .setDescription('Short Seth Query')
    .addStringOption(option =>
      option.setName('input')
        .setDescription('The input to ask Seth'))
    .addStringOption(option =>
      option.setName('thread')
        .setDescription('Start a thread with Seth')),
  action: async (interaction) => {
    const input = interaction.options.getString('input')
    const thread_input = interaction.options.getString('thread')
    if(input){
      await interaction.reply(`Prompt: ${input}`);
      const response = await sethPrompt(input)
      await interaction.editReply(`Prompt: ${input}\n${response}`);

    } else if (thread_input) {
      const threadManager = interaction.channel.threads;
      await interaction.reply(`Creating thread: ${thread_input}...`)

      // create the thread
      threadManager.create({
        name: `Seth Thread: ${thread_input}`,
        autoArchiveDuration: 60,
        reason: 'Thread created by bot'
      }).then(async thread => {
        
        // code to save information about the thread server-side
        createThread(thread, 'seth')
        interaction.editReply("Thread created!")

        // respond in the thread
        const response = await sethPrompt(thread_input, { user: interaction.user.username })
        thread.send(response)

        subscribeToThread(thread, threadResponse)
      });
    }
  },
  threadType: 'seth',
  threadResponse
}

export { seth }