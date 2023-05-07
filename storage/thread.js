import { prisma } from "./database.js";
import { ThreadChannel } from "discord.js";

async function subscribeToThread(thread, response) {
  if (!(thread instanceof ThreadChannel)) {
    console.log(`Channel ${thread.id} is not a thread.`);
    return;
  } else {
    console.log(`Subscribing to thread: ${thread.id}`);
  }

  // build collector
  const filter = (reply) => reply.author.id !== thread.client.user.id;
  const collector = thread.createMessageCollector({ filter });

  // receive messages
  collector.on("collect", async (reply) => {
    console.log(`New reply: ${reply.content}`);

    if (!response) {
      thread.send(`Thank you for your reply, ${reply.author.username}!`);
    } else {
      const msg = await thread.send(`Reply loading...`);
      await response(reply.content, thread, msg);
    }
  });
}

const createThread = (thread, type = "unknown") => {
  const data = {
    id: thread.id,
    channelId: thread.parentId,
    guildId: thread.guildId,
    name: thread.name,
    type: type,
  };
  prisma.thread
    .create({
      data,
    })
    .then((thread) => {
      console.log(`Created thread "${thread.name}" with ID ${thread.id}`);
    })
    .catch((error) => {
      console.error("Error creating thread:", error);
    });
};

export { createThread, subscribeToThread };
