import { shitcoinPrompt } from "./customPrompts/shitcoinPrompt.js";

import { createAICommand } from "./defaultAI.js";

const shitcoin = createAICommand({
  aiName: "Shitcoin Master",
  aiCommandName: "shitcoin",
  aiPrompt: shitcoinPrompt,
});

export { shitcoin };
