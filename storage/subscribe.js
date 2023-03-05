import { subscribeToThread } from './thread.js';
import { prisma } from './database.js';
import { commands } from '../commands/index.js';

async function subscribeToAllThreads(client) {
  // Load all threads from the database using Prisma
  const threads = await prisma.thread.findMany();

  // Subscribe to each thread by ID
  for (const knownThread of threads) {
    const command = commands.find(command => command.threadType === knownThread.type);
    if(command) {
      try{
        const thread = await client.channels.fetch(knownThread.id);
        await subscribeToThread(thread, command.threadResponse);
      } catch (error) {
        console.log(error)
      }
    }
  }
}

const setUpAllSubscriptions = async (client) => {
  await subscribeToAllThreads(client);
}

export { setUpAllSubscriptions }