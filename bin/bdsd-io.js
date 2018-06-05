#!/usr/bin/env node
const defaultSockFile = process.env['XDG_RUNTIME_DIR'] + '/bdsd.sock';

const argv = require('yargs')
  .option('sockfile', {
    alias: 's',
    describe: `path to socket file. Default: ${process.env['XDG_RUNTIME_DIR']}/bdsd.sock'`,
    default: defaultSockFile
  })
  .option('port', {
    alias: 'p',
    describe: 'port that socket.io listens to',
    default: 49199
  })
  .argv;

let params = {
  sockFile: argv['sockfile'],
  port: argv['port']
};

require('../index.js')(params);
