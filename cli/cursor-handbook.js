#!/usr/bin/env node

'use strict';

const path = require('path');
const pkg = require('../package.json');

const args = process.argv.slice(2);
const command = args[0];

function printHelp() {
  console.log(`
  cursor-handbook v${pkg.version}
  Cursor IDE configuration boilerplate

  Usage:
    cursor-handbook <command> [options]

  Commands:
    init          Copy .cursor/ folder and setup files into your project

  Options:
    --all             Copy all components (skip category selection)
    --target <path>   Target directory (defaults to current directory)
    --force           Overwrite existing .cursor/ without prompting
    --help, -h        Show this help message
    --version, -v     Show version number

  Examples:
    npx cursor-handbook init                    # interactive category picker
    npx cursor-handbook init --all              # copy everything at once
    npx cursor-handbook init --target ./my-app  # specify target directory
    npx cursor-handbook init --all --force      # overwrite without prompting
  `);
}

if (command === '--help' || command === '-h' || !command) {
  printHelp();
  process.exit(0);
}

if (command === '--version' || command === '-v') {
  console.log(pkg.version);
  process.exit(0);
}

if (command === 'init') {
  const setup = require('../lib/setup');

  const targetIdx = args.indexOf('--target');
  const targetDir = targetIdx !== -1 && args[targetIdx + 1]
    ? path.resolve(args[targetIdx + 1])
    : process.cwd();

  const force = args.includes('--force');
  const all = args.includes('--all');

  setup.init(targetDir, { force, all }).catch((err) => {
    console.error(`\n  Error: ${err.message}\n`);
    process.exit(1);
  });
} else {
  console.error(`\n  Unknown command: ${command}\n`);
  printHelp();
  process.exit(1);
}
