# bdsd-io: Socket.IO support for Bobaos Datapoint Sdk

# Installation

Before installing this module, make sure that [bdsd.sock](https://github.com/shabunin/bdsd.sock) is installed and configured properly. If not, follow instructions on repository page.

Is it configured and systemd service is running then proceed to following steps:

**1. Install bdsd-io package by npm**

```bash
$ sudo npm install -g bdsd-io --unsafe-perm
```

**4. Create service file in user systemd folder **

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

**5. Enable service**

```bash
$ systemctl --user daemon-reload
$ systemctl --user enable bdsd-io.service
```

**6. Start service**

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

