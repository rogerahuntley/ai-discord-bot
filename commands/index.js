import { ai } from "./ai.js";
import { ra } from "./ra.js";

import { DEV } from "../devops/environmentVariables.js";

let commands = [ai, ra]

commands.forEach(command => command.definition = command.definition.toJSON())

if(DEV){
  commands.forEach(command => {
    command.name            = `dev-${command.definition.name}`
    command.definition.name = `dev-${command.definition.name}`
  })
}

export { commands };