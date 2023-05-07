import { sethPrompt } from "./customPrompts/sethPrompt.js";

import { createAICommand } from "./defaultAI.js";

const seth = createAICommand({
  aiName: "Seth",
  aiCommandName: "seth",
  aiPrompt: sethPrompt,
});

export { seth };
