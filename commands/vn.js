import { vnPrompt } from "./customPrompts/vnPrompt.js";

import { createAICommand } from "./defaultAI.js";

const vn = createAICommand({
  aiName: "VN Assistant",
  aiCommandName: "vn",
  aiPrompt: vnPrompt,
});

export { vn };
