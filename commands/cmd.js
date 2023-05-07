import { prompts } from "../lib/ai/index.js";
const { commandPrompt } = prompts;

import { createAICommand } from "./defaultAI.js";

const cmd = createAICommand({
  aiName: "Terminal",
  aiCommandName: "cmd",
  aiPrompt: commandPrompt,
});

export { cmd };
