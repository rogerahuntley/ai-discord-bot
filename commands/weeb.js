import { weebPrompt } from "./customPrompts/weebPrompt.js";

import { createAICommand } from "./defaultAI.js";

const weeb = createAICommand({
  aiName: "Weeb",
  aiCommandName: "weeb",
  aiPrompt: weebPrompt,
});

export { weeb };
