import { lawOfOnePrompt } from "./customPrompts/lawOfOnePrompt.js";

import { createAICommand } from "./defaultAI.js";

const ra = createAICommand({
  aiName: "Ra",
  aiCommandName: "ra",
  aiPrompt: lawOfOnePrompt,
});

export { ra };
