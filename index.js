#!/usr/bin/env node

const debounce = require('lodash.debounce');
const chokidar = require('chokidar');
const program = require('caporal');
const fs = require('fs');
const { spawn } = require('child_process');
const chalk = require('chalk');

program
    .version('0.0.1')
    .argument('[filename]', 'Name of a file to execute')
    .action(async ({ filename }) => {
        // Check if user provided a filename
        const name = filename || 'index.js';

        // Check whether filename provided actually exists
        try {
            await fs.promises.access(name);
        } catch (err) {
            throw new Error(`Could not find the file ${name}`);
        }

        let proc;
        // start function has to wait 100ms without a new 'add' before being triggered
        const start = debounce(() => {
            // If there is a process, kill it
            if (proc) {
                proc.kill();
            }
            // Let the user know there's a new version of the program running (in cyan color)
            console.log(chalk.cyan('>>>> Starting process...'));
            proc = spawn('node', [name], { stdio: 'inherit' });
        }, 100);

        // Watch for file additions, changes, and deletions
        chokidar
            .watch('.')
            .on('add', start)
            .on('change', start)
            .on('unlink', start);        
    });

program.parse(process.argv);