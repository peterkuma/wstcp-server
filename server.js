'use strict'

const _ = require('lodash');
const http = require('http');
const wstcpServer = require('wstcp').server;


module.exports = function(config) {
  const httpServer = http.createServer();

  _.each(_.get(config, 'clients'), (client, name) => {
    if (client.port == undefined || client.key === undefined) {
      return;
    }

    function verify(info, cb) {
      let key = info.req.headers['x-key'];
      if (client.key && key === client.key) {
        return cb(true);
      }
      return cb(false);
    }

    let server = wstcpServer({
      server: httpServer,
      path: '/' + name,
      tcpPort: client.port,
      remote: !!client.remote,
      verifyClient: verify
    });

    server.on('connection', stream => {
      let address = _.get(stream, 'socket.upgradeReq.connection.remoteAddress');
      let port = _.get(stream, 'socket.upgradeReq.connection.remotePort');
      log.info(`${name} [${address}:${port}]: Connection established`);
    });

    server.on('tcp-connection', (data, stream) => {
      let address = _.get(stream, 'socket.upgradeReq.connection.remoteAddress');
      let port = _.get(stream, 'socket.upgradeReq.connection.remotePort');
      log.info(`${name} [${address}:${port}]: TCP forwarding connection established`);
      // if (client.remote) {
      //   log.info(`${name} [${address}:${port}]: TCP connection from ${data.localAddress}:${data.localPort} established`);
      // } else {
      //   log.info(`${name} [${address}:${port}]: TCP connection to ${data.remoteAddress}:${data.remotePort} established`);
      // }
    });

    server.on('end', stream => {
      let address = _.get(stream, 'socket.upgradeReq.connection.remoteAddress');
      let port = _.get(stream, 'socket.upgradeReq.connection.remotePort');
      log.info(`${name} [${address}:${port}]: Connection closed`);
    });

    server.on('error', err => {
      if (err.errno = 'EBUSY') {
        let address = _.get(err.stream, 'socket.upgradeReq.connection.remoteAddress');
        let port = _.get(err.stream, 'socket.upgradeReq.connection.remotePort');
        log.info(`${name} [${address}:${port}]: ${err.message}`);
        return;
      }
      log.error(err, err.message)
    });
  });

  httpServer.listen(config.port, config.hostname, () => {
    let url = require('url').format({
      protocol: 'ws',
      port: config.port,
      hostname: config.hostname || '::',
      slashes: true
    });
    log.info('Listening on ' + url);
  });
}
