import { ai } from "./ai.js";
import { ra } from "./ra.js";
import { seth } from './seth.js';

import { DEV } from "../devops/environmentVariables.js";

let commands = [ai, ra, seth]

commands.forEach(command => command.definition = command.definition.toJSON())

if(DEV){
  commands.forEach(command => {
    command.name            = `dev-${command.definition.name}`
    command.definition.name = `dev-${command.definition.name}`
  })
}

export { commands };