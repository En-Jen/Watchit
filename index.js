#!/usr/bin/env node

const debounce = require('lodash.debounce');
const chokidar = require('chokidar');

// start function has to wait 100ms without a new 'add' before being triggered
const start = debounce(() => {
    console.log('STARTING USERS PROGRAM');
}, 100);

// Watches for file additions, changes, and deletions
chokidar
    .watch('.')
    .on('add', start)
    .on('change', () => console.log('FILE CHANGED'))
    .on('unlink', () => console.log('FILE UNLINKED'));

