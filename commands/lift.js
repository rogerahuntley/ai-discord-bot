import { liftPrompt } from "./customPrompts/liftPrompt.js";
import { createAICommand } from "./defaultAI.js";

const lift = createAICommand({
  aiName: "Wellness Assistant",
  aiCommandName: "lift",
  aiPrompt: liftPrompt,
});

export { lift };
