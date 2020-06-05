#!/usr/bin/env node
const chalk = require('chalk');
const figlet = require('figlet');
const program = require('commander');
import * as prompt from "./prompt";

console.log(
    chalk.red(
      figlet.textSync('TSEO', { horizontalLayout: 'full' })
    )
  );

  program
  .version('0.0.4')
  .description("A minimalistic NodeJS based Typescript, Expressjs and TypeORM boilerplate generator")
  .option('-O, --no-typeorm', 'You do not want any TypeORM')
  .parse(process.argv);

prompt.promptFn();
