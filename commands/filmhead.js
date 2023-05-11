import { filmheadPrompt } from "./customPrompts/filmheadPrompt.js";
import { createAICommand } from "./defaultAI.js";

const filmhead = createAICommand({
  aiName: "Jockey",
  aiCommandName: "filmhead",
  aiPrompt: filmheadPrompt,
});

export { filmhead };
