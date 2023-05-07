import { SlashCommandBuilder } from 'discord.js';
import { jockeyPrompt } from './customPrompts/jockeyPrompt.js'
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
      username: message.isBot ? 'JockeyGPT' : message.username,
      content: message.content
    }})
  .filter(message => typeof message.content === 'string')
  const response = await jockeyPrompt(input, { thread: thread.name, messages, username: messages.at(-1).username })
  return response
}

const jockey = {
  disabled: false,
  definition:
    new SlashCommandBuilder()
    .setName('jockey')
    .setDescription('Short JockeyGPT Query')
    .addStringOption(option =>
      option.setName('input')
        .setDescription('The input to ask JockeyGPT'))
    .addStringOption(option =>
      option.setName('thread')
        .setDescription('Start a thread with JockeyGPT')),
  action: async (interaction) => {
    const input = interaction.options.getString('input')
    const thread_input = interaction.options.getString('thread')
    if(input){
      await interaction.reply(`Prompt: ${input}`);
      const response = await jockeyPrompt(input, { username: interaction.user.username })
      await interaction.editReply(`Prompt: ${input}\n${response}`);

    } else if (thread_input) {
      const threadManager = interaction.channel.threads;
      await interaction.reply(`Creating thread: ${thread_input}...`)

      // create the thread
      threadManager.create({
        name: `JockeyGPT Thread: ${thread_input}`,
        autoArchiveDuration: 60,
        reason: 'Thread created by bot'
      }).then(async thread => {
        
        // code to save information about the thread server-side
        createThread(thread, 'jockey')
        interaction.editReply("Thread created!")

        // respond in the thread
        const response = await jockeyPrompt(thread_input, { username: interaction.user.username })
        thread.send(response)

        subscribeToThread(thread, threadResponse)
      });
    }
  },
  threadType: 'jockey',
  threadResponse
}

export { jockey }