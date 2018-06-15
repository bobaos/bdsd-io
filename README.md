# bdsd-io: Socket.IO support for Bobaos Datapoint Sdk

# Installation

Before installing this module, make sure that [bdsd.sock](https://github.com/shabunin/bdsd.sock) is installed and configured properly. If not, follow instructions on repository page.

Is it configured and systemd service is running then proceed to following steps:

**1. Install bdsd-io package by npm**

```bash
$ sudo npm install -g bdsd-io --unsafe-perm
```

```bash
$ bdsd-io --help
Options:
  --help          Show help                                            [boolean]
  --version       Show version number                                  [boolean]
  --sockfile, -s  path to socket file.     [default: "/run/user/1000/bdsd.sock"]
  --port, -p      port that socket.io listens to                [default: 49199]
```

**2. Create service file in user systemd folder**

```bash
$ touch ~/.config/systemd/user/bdsd-io.service
```

Then add following to this file using your favourite text editor:

```
[Unit]
Description=Socket.IO support for Bobaos Datapoint Sdk Daemon

[Service]
ExecStart=/usr/bin/env bdsd-io

[Install]
WantedBy=default.target
```

**3. Enable service**

```bash
$ systemctl --user daemon-reload
$ systemctl --user enable bdsd-io.service
```

**4. Start service**

```bash
$ systemctl --user start bdsd-io.service
```

# Usage

Now you may connect to bdsd-io service by using [socket.io-client](https://github.com/socketio/socket.io-client) library.

Node.JS client:

```js
const socket = require('socket.io-client')('http://<RPi ip address>:49199');
socket.on('connect', _ => {
  console.log('Connected to bobaos server!');
  socket.emit('get value', 1, function(err, payload) {
    if (err) {
      throw new Error(err)
    }
    console.log('Got datapoint 1 value: ', payload);
  });
  socket.on('value', function(payload){
    console.log('got broadcasted value:', payload);
  });
})
```

Browser:

```html
<script src="/socket.io/socket.io.js"></script>
<script>
  var socket = io('http://<RPi ip address>:49199');
  socket.on('connect', function(){
    console.log('Connected to bobaos server!');
    io.emit('get value', 1, function(err, payload) {
      if (err) {
        throw new Error(err)
      }
      console.log('Got datapoint 1 value: ', payload);
    })
  });
  socket.on('value', function(payload){
    console.log('got broadcasted value:', payload);
  });
</script>
```

You may also check example folder for nodejs and [CommandFusion](https://commandfusion.com) example.

By default, socket.io binds to port 49199. If you want to use other you may change it in index.js file.

# Protocol

In order to communicate through socket.io you should use socket.emit function.

```
socket.emit(<method>, [params], callback);
```

## Methods

**1. get datapoonts**

Get description for all configured datapoints.

Request: 

```js
socket.emit('get datapoints', function(err, res) {
  if (err) {
    throw err;
  }
  console.log(res);
});
```

Response:

```
[ { id: 1,
    length: 2,
    flags:
     { priority: 'low',
       communication: true,
       read: true,
       write: true,
       readOnInit: false,
       transmit: true,
       update: false },
    dpt: 'dpt9' },
  { id: 2,
    length: 1,
    flags:
     { priority: 'low',
       communication: true,
       read: false,
       write: true,
       readOnInit: false,
       transmit: true,
       update: false },
    dpt: 'dpt5' } ]
```

**2. get description**

Get description for specified datapoint.

Requires datapoint **id** as parameter.

Request:

```js
socket.emit('get description', 1, function(err, res) {
  if (err) {
    throw err;
  }
  console.log(res);
});
```

Response:

```
{ id: 1,
  value:
   { id: 1,
     dpt: 'dpt9',
     flags:
      { priority: 'low',
        communication: true,
        read: true,
        write: true,
        readOnInit: false,
        transmit: true,
        update: false },
     length: 2 } }
```

**3. get value**

Get value for specified datapoint.

Requires datapoint **id** as parameter.

Request:

```js
socket.emit('get value', 1, function(err, res) {
  if (err) {
    throw err;
  }
  console.log(res);
});
```

Response:

```
{ id: 1, value: 19.9 }
```

**4. set value**

Set datapoint value and send it to KNX bus.

Requires datapoint **id** as parameter.

Requires datapoint **value** as parameter

Request:

```js
socket.emit('set value', 1, 20, function(err, res) {
  if (err) {
    throw err;
  }
  console.log(res);
});
```

Response:

```
{ id: 1 }
```

**5. read value**

Send read request to KNX bys. 

Requires datapoint **id** as parameter.

Request:

```js
socket.emit('read value', 1, function(err, res) {
  if (err) {
    throw err;
  }
  console.log(res);
});
```

Response:

```
{ id: 1}
```

**6. get stored value**

Send read request to KNX bys.

Requires datapoint **id** as parameter.

Request:

```js
socket.emit('get stored value', 1, function(err, res) {
  if (err) {
    throw err;
  }
  console.log(res);
});
```

Response:

```
{ id: 1, value: 1, raw: {type: 'Buffer', data: [1]}}
```

**7. read values**

Send read request for multiple values

Requires array of datapoints.

Request:

```js
socket.emit('read value', [1], function(err, res) {
  if (err) {
    throw err;
  }
  console.log(res);
});
```

Response:

```
{ id: 1}
```

**8. set values**

Send read request to KNX bys.

Requires datapoint values as an array: `[{id: 1, value: 1}, {id: 2, value: 2}]`

Request:

```js
socket.emit('set values', [{id: 1, value: 1}, {id: 2, value: 2}], function(err, res) {
  if (err) {
    throw err;
  }
  console.log(res);
});
```

Response:

```
[{id: 1, value: 1}, {id: 2, value: 2}]
```

## Incoming events

**1. Value indication**

When datapoint changed on bus, e.g. temperature value were sent on change, you will receive 'value' event. So, you should register this event:

```js
socket.on('value', function(payload) {
  console.log('broadcasted value', payload);
})
```

When running:

```
broadcasted value { id: 1, value: 19.9 }
broadcasted value { id: 1, value: 20.2 }
```