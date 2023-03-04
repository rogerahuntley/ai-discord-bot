import { ai } from "./ai.js";
import { ra } from "./ra.js";
import { seth } from './seth.js';
import { playlist } from "./playlist.js";

import { DEV } from "../devops/environmentVariables.js";

let commands = [ai, ra, seth, playlist]

commands.forEach(command => command.definition = command.definition.toJSON())
commands = commands.filter(command => !command.disabled)

if(DEV){
  commands.forEach(command => {
    command.name            = `dev-${command.definition.name}`
    command.definition.name = `dev-${command.definition.name}`
  })
} else {
  commands.forEach(command => {
    command.name            = command.definition.name
  })
}

export { commands };