import { SlashCommandBuilder } from 'discord.js';
import { liftPrompt } from './customPrompts/liftPrompt.js'
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
      username: message.isBot ? 'LiftGPT' : message.username,
      content: message.content
    }})
  .filter(message => typeof message.content === 'string')
  const response = await liftPrompt(input, { thread: thread.name, messages, username: messages.at(-1).username })
  return response
}

const lift = {
  disabled: false,
  definition:
    new SlashCommandBuilder()
    .setName('lift')
    .setDescription('Short LiftGPT Query')
    .addStringOption(option =>
      option.setName('input')
        .setDescription('The input to ask LiftGPT'))
    .addStringOption(option =>
      option.setName('thread')
        .setDescription('Start a thread with LiftGPT')),
  action: async (interaction) => {
    const input = interaction.options.getString('input')
    const thread_input = interaction.options.getString('thread')
    if(input){
      await interaction.reply(`Prompt: ${input}`);
      const response = await liftPrompt(input, { username: interaction.user.username })
      await interaction.editReply(`Prompt: ${input}\n${response}`);

    } else if (thread_input) {
      const threadManager = interaction.channel.threads;
      await interaction.reply(`Creating thread: ${thread_input}...`)

      // create the thread
      threadManager.create({
        name: `LiftGPT Thread: ${thread_input}`,
        autoArchiveDuration: 60,
        reason: 'Thread created by bot'
      }).then(async thread => {
        
        // code to save information about the thread server-side
        createThread(thread, 'lift')
        interaction.editReply("Thread created!")

        // respond in the thread
        const response = await liftPrompt(thread_input, { username: interaction.user.username })
        thread.send(response)

        subscribeToThread(thread, threadResponse)
      });
    }
  },
  threadType: 'lift',
  threadResponse
}

export { lift }