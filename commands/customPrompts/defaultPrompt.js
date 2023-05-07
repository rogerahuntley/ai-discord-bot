import { defaultOptions, prompts } from "../../lib/ai/index.js";
const { basePrompt } = prompts;

const assistantOptions = {
  temperature: 0.3,
  frequency_penalty: 0.6,
  max_tokens: 2500,
  top_p: 1,
  presence_penalty: 0.8,
  discord: true,
  assistant: true,
};

const creativeOptions = {
  temperature: 0.9,
  frequency_penalty: 0.8,
  max_tokens: 2500,
  top_p: 1,
  presence_penalty: 0.8,
  discord: true,
};

const creativeAssistantOptions = {
  temperature: 0.6,
  frequency_penalty: 0.7,
  max_tokens: 2500,
  top_p: 1,
  presence_penalty: 0.8,
  discord: true,
};

const defaultBuildOptions = {
  instructions: `You are DefaultGPT, you need the user that there is an error in the code. They should contact the developer to get this issue resolved.`,
  discordInstruction:
    "This is a discord message, so try to keep it concise and short. You can use markdown to format your message.",
  options: assistantOptions,
  exampleConvo: [],
};

const createAIPrompt = (buildOptions) => {
  buildOptions = { ...defaultBuildOptions, ...buildOptions };

  const defaultPrompt = async (prompt, options, axios) => {
    options = {
      ...defaultOptions,
      ...options,
      ...buildOptions.options,
    };

    const username = options.username || "User";

    const chatMessages = options.messages || [
      { role: "user", username: username, content: prompt },
    ];

    const instruction = {
      role: "system",
      name: "instructions",
      content:
        (buildOptions.instructions += `\n${buildOptions.discordInstruction}`),
    };

    const history = [];

    chatMessages.forEach((message) => {
      history.push({
        role: message.role,
        name: message.username,
        content: `${message.content}`,
      });
    });

    if (buildOptions.exampleConvo.length > 0) {
      instruction.content =
        instruction.content +
        `
      Example conversation:
      ${buildOptions.exampleConvo
        .map((message) => {
          return `${message.role == "user" ? "Prompt" : "Response"}: ${
            message.content
          }`;
        })
        .join("\n")}
      Example conversation end.`;
    }

    const finalMessages = [instruction, ...history];

    return basePrompt(
      {
        ...options,
        messages: finalMessages,
      },
      axios
    );
  };

  return defaultPrompt;
};

export {
  assistantOptions,
  creativeOptions,
  creativeAssistantOptions,
  createAIPrompt,
};
