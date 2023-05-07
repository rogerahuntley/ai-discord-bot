import { ai } from "./ai.js";
import { ra } from "./ra.js";
import { seth } from './seth.js';
import { cmd } from './cmd.js';
import { lain } from './lain.js';
import { music } from './music.js';
import { write } from './write.js';
import { vn } from './vn.js';
import { lift } from './lift.js'
import { admin } from './admin.js'
import { weeb } from './weeb.js'
import { jockey } from './jockey.js'

import { DEV } from "../devops/environmentVariables.js";

let commands = [ai, ra, seth, cmd, lain, music, write, vn, lift, admin, weeb, jockey];

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