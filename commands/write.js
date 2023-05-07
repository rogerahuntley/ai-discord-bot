import { writePrompt } from "./customPrompts/writePrompt.js";

import { createAICommand } from "./defaultAI.js";

const write = createAICommand({
  aiName: "Writing Assistant",
  aiCommandName: "write",
  aiPrompt: writePrompt,
});

export { write };
