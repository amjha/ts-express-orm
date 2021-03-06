#!/usr/bin/env node
const chalk = require("chalk");
const figlet = require("figlet");
const program = require("commander");
import * as prompts from "./prompts";

console.log(chalk.green(figlet.textSync("TSEO", { horizontalLayout: "full" })));

program
  .version("0.0.7")
  .description(
    "A minimalistic NodeJS based Typescript, Expressjs and TypeORM boilerplate generator"
  )
  .parse(process.argv);

prompts.promptsFn();
