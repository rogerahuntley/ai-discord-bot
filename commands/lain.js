import { lainPrompt } from "./customPrompts/lainPrompt.js";
import { createAICommand } from "./defaultAI.js";

const lain = createAICommand({
  aiName: "Lain",
  aiCommandName: "lain",
  aiPrompt: lainPrompt,
});

export { lain };
