import { musicPrompt } from "./customPrompts/musicPrompt.js";

import { createAICommand } from "./defaultAI.js";

const music = createAICommand({
  aiName: "Music Assistant",
  aiCommandName: "music",
  aiPrompt: musicPrompt,
});

export { music };
