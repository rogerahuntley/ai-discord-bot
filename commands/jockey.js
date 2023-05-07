import { jockeyPrompt } from "./customPrompts/jockeyPrompt.js";
import { createAICommand } from "./defaultAI.js";

const jockey = createAICommand({
  aiName: "Jockey",
  aiCommandName: "jockey",
  aiPrompt: jockeyPrompt,
});

export { jockey };
