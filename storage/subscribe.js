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
        if(!thread){
          console.log(`Thread ${knownThread.id} not found.`);
          prisma.threads.delete({
            where: {
              id: knownThread.id
            }
          }).then(() => {
            console.log(`Deleted thread ${knownThread.id} from database.`);
          }).catch(error => {
            console.error('Error deleting thread:', error);
          });
          continue;
        }
        await subscribeToThread(thread, command.threadResponse);
      } catch (error) {
        console.error(error)
      }
    }
  }
}

const setUpAllSubscriptions = async (client) => {
  await subscribeToAllThreads(client);
}

export { setUpAllSubscriptions }