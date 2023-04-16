import { ai } from "./ai.js";
import { ra } from "./ra.js";
import { seth } from './seth.js';
import { cmd } from './cmd.js';
import { lain } from './lain.js';
import { music } from './music.js'

import { DEV } from "../devops/environmentVariables.js";

let commands = [ai, ra, seth, cmd, lain, music]

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