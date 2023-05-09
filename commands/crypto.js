import { cryptoPrompt } from "./customPrompts/cryptoPrompt.js";

import { createAICommand } from "./defaultAI.js";

const crypto = createAICommand({
  aiName: "Crpyto Guru",
  aiCommandName: "crypto",
  aiPrompt: cryptoPrompt,
});

export { crypto };
