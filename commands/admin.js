import { adminPrompt } from "./customPrompts/adminPrompt.js";
import { createAICommand } from "./defaultAI.js";

const admin = createAICommand({
  aiName: "Sysadmin Assistant",
  aiCommandName: "admin",
  aiPrompt: adminPrompt,
});

export { admin };
