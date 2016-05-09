'use strict'

const _ = require('lodash');
const bunyan = require('bunyan');
const PrettyStream = require('bunyan-prettystream');
const argv = require('minimist')(process.argv.slice(2));
const fs = require('fs');

const server = require('./server.js');


const defaultConfig = {
};

const configFile = argv._[0] ||
  require('path').resolve(__dirname, 'config.json');

let config;
try {
  config = _.defaults(JSON.parse(fs.readFileSync(configFile)), defaultConfig);
} catch (err) {
  console.error('Cannot read config file: ' + err.message);
  process.exit(1);
}

const consoleStream = (new PrettyStream())
consoleStream.pipe(process.stderr);

global.log = bunyan.createLogger({
  name: 'wstcp-server',
  level: 'info',
  type: 'raw',
  stream: consoleStream
});

if (config.log) {
  global.log = bunyan.createLogger({
    name: 'wstcp-server',
    streams: [
      {
        level: 'info',
        type: 'raw',
        stream: consoleStream
      },
      {
        level: 'info',
        path: require('path').resolve(
          require('path').dirname(configFile),
          config.log
        )
      }
    ]
  });
}

process.on('uncaughtException', err => {
  log.error(err, 'Uncought exception: ' + err.message);
});

server(config);
