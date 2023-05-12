import { defaultOptions, prompts } from "../../lib/ai/index.js";
const { basePrompt } = prompts;

const superBaseOptions = {
  temperature: 0.9,
  frequency_penalty: 0.8,
  max_tokens: 2500,
  top_p: 1,
  presence_penalty: 0.8,
};

const assistantOptions = {
  ...superBaseOptions,
  temperature: 0.3,
};

const creativeAssistantOptions = {
  ...superBaseOptions,
  temperature: 0.6,
};

const creativeOptions = {
  ...superBaseOptions,
  temperature: 0.9,
};

const defaultBuildOptions = {
  instructions: `You are Default, you need to tell the user that there is an error in the code. They should contact the developer to get this issue resolved.`,
  discordInstruction:
    `This is a discord message, so try to keep it concise and short. Return less than 1800 chracters. You can use markdown to format your message.`,
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

    const username = options.username || options.name || "User";

    const chatMessages = options.messages || [
      { role: "user", name: username, content: prompt },
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
        name: message.name || message.username,
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

    const finalMessages = [instruction, ...history].map(
      ({ role, name, content }) => {
        return role == "system" ? { role, name, content } : { role, content };
      }
    );

    console.log({
      ...options,
      messages: finalMessages,
    })

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
