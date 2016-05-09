'use strict'

const program = require('commander');
const Service = require('node-windows').Service;

let command;

program
  .command('install')
  .action(() => {
    command = 'install'
  });

program
  .command('uninstall')
  .action(() => {
    command = 'uninstall';
  });

program.parse(process.argv);

let svc = new Service({
  name: 'wstcp Server',
  script: require('path').join(__dirname, 'main.js'),
  maxRestarts: 1
});

svc.on('install', function() {
  console.log('Service installed');
  svc.start();
});

svc.on('uninstall' ,function() {
  console.log('Service uninstalled');
});

if (command === 'install') {
  svc.install();
} else if (command === 'uninstall') {
  svc.uninstall();
} else {
  program.help();
}
