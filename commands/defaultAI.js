import { SlashCommandBuilder } from "discord.js";
import { createThread, subscribeToThread } from "../storage/thread.js";

import { prompts } from "../lib/ai/index.js";
const { simplePrompt } = prompts;

const MESSAGE_DELAY = 5000;

const defaultOptions = {
  aiName: "DefaultAI",
  aiCommandName: "defaultai",
  aiPrompt: simplePrompt,
  disabled: false,
};

const createAICommand = (options) => {
  if (!options.aiCommandName)
    options.aiCommandName = options.aiName.toLowerCase();
  options = { ...defaultOptions, ...options };

  console.log(`Creating ${options.aiName} command...`);

  const delayedResponse = async (
    editFunc,
    prompt,
    promptOptions,
    wrapPrompt = (s) => s
  ) => {
    // message is discord message
    // response is a streaming promise
    // options gets sent to the ai prompt

    // sent before
    // const msg = await thread.send(`Loading Response...`);

    let buildingResponse = "";
    let updateTimer = null;
    let response = null;

    try {
      // aiPrompt returns a streamable promise
      response = options.aiPrompt(prompt, {
        ...promptOptions,
        stream: true,
        handleStream: async (response) => {
          buildingResponse = response;
        },
      });

      // update partial message every second
      updateTimer = setInterval(async () => {
        if (buildingResponse) {
          await editFunc(wrapPrompt(buildingResponse));
        }
      }, MESSAGE_DELAY);

      // wait for the response to finish building
      await response.then((response) => {
        // send the response to the thread
        clearInterval(updateTimer);
        editFunc(wrapPrompt(response.toString()));
      });
    } catch (err) {
      console.log(err);
      clearInterval(updateTimer);
      editFunc(wrapPrompt("Error"));
    }

    return response;
  };

  const threadResponse = async (input, thread, msg) => {
    const messages = await (
      await thread.messages.fetch({ limit: 20 })
    )
      .reverse()
      .filter((message) => {
        return message.id != msg.id; // dont send the "loading" msg
      })
      .map((message) => {
        return {
          id: message.id,
          isBot: message.author.id == thread.client.user.id,
          username: message.author.username,
          content: message.content,
        };
      })
      .map((message) => {
        return {
          role: message.isBot ? "assistant" : "user",
          name: message.isBot ? options.aiName : message.username,
          content: message.content,
        };
      })
      .filter((message) => typeof message.content === "string");

    const response = await delayedResponse(
      (content) => msg.edit({ content: content.slice(0, 1800) }),
      input,
      {
        thread: thread.name,
        messages,
        name: messages.at(-1)?.name,
      }
    );
    return response;
  };

  const interactionAction = async (interaction) => {
    const input = interaction.options.getString("input");
    const thread_input = interaction.options.getString("thread");
    if (input) {
      await interaction.reply(`Prompt: ${input}`);
      // deplayed response will update the message for us
      const response = await delayedResponse(
        (content) => interaction.editReply(content.slice(0, 1800)),
        input,
        {
          name: interaction.user.username,
        },
        (s) => `Prompt: ${input}\n${s}`
      );
      return response;
    } else if (thread_input) {
      const threadManager = interaction.channel.threads;
      await interaction.reply(`Creating thread: ${thread_input}...`);

      let thread_title = "";
      try {
      // truncate the thread title if it's too long
        thread_title = await simplePrompt(
          "summarize this into a short title: " + thread_input,
          { model: "gpt-3.5-turbo" }
        );
        thread_title = thread_title.slice(0, 90);
      } catch(err) {
        console.log(err);
        thread_title = thread_input.slice(0, 90);
      }

      // create the thread
      threadManager
        .create({
          name: `${options.aiName} Thread: ${thread_title}`,
          autoArchiveDuration: 60,
          reason: "Thread created by bot",
        })
        .then(async (thread) => {
          // code to save information about the thread server-side
          await createThread(thread, options.aiName);
          await subscribeToThread(thread, threadResponse);

          interaction.editReply("Thread created!");

          // respond in the thread
          const msg = await thread.send(`Loading Response...`);

          // deplayed response will update the message for us
          const response = await delayedResponse(
            (content) => msg.edit({ content: content.slice(0, 1800) }),
            thread_input,
            {
              // url encode
              // username:  interaction.user.username,
              name: interaction.user.username,
            }
          );

          return response;
        });
    }
  };

  const defaultAICommand = {
    disabled: options.disabled,
    definition: new SlashCommandBuilder()
      .setName(options.aiCommandName)
      .setDescription(`Short ${options.aiName} Query`)
      .addStringOption((option) =>
        option
          .setName("input")
          .setDescription(`The input to ask ${options.aiName}`)
      )
      .addStringOption((option) =>
        option
          .setName("thread")
          .setDescription(`Start a thread with ${options.aiName}`)
      ),
    action: interactionAction,
    threadType: options.aiName,
    threadResponse,
  };

  return defaultAICommand;
};

export { createAICommand };
