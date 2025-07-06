
import { createMastra } from "@mastra/core"; 

import { berkshireAgent } from "../agents/berkshireAgent";

export const mastra = createMastra({
  agents: {
    berkshire: berkshireAgent, 
  },
  
});