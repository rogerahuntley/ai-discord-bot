import { subscribeToThread } from './thread.js';
import { prisma } from './database.js';
import { commands } from '../commands/index.js';

async function subscribeToAllThreads(client) {
  // Load all threads from the database using Prisma
  let threads = await prisma.thread.findMany();
  threads = threads.filter(thread => thread.type && !thread.type.match(/unknown|undefined/))
                   .sort((a, b) => { a.type.localeCompare(b.type) });

  // Group threads by type
  const typedThreads = threads.reduce((typed, thread) => {
    const type = (typed[thread.type] || []);
    type.push(thread);
    typed[thread.type] = type;
    return typed;
  }, {});

  // Subscribe to each thread by type
  for (const element of Object.entries(typedThreads)) {
    const [_command, threads] = element;
    const command = commands.find(command => command.threadType === _command);
    if(!command) continue;
    console.log(`Subscribing to ${threads.length} threads of type: ${_command}`)

    // Subscribe to each thread by ID
    for (const knownThread of threads) {
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