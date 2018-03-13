# bdsd-io: Socket.IO support for Bobaos Datapoint Sdk

# Installation

Before installing this module, make sure that [bdsd.sock](https://github.com/shabunin/bdsd.sock) is installed and configured properly. If not, follow instructions on repository page.

Is it configured and systemd service is running then proceed to following steps:

**1. Clone this repository**

```bash
$ cd ~/
$ git clone https://github.com/shabunin/bdsd-io
```

**2. Install dependencies**

```bash
$ cd ~/bdsd-io
$ npm install
```

**3. Make sure that it runs correctly**

```bash
$ node index.js
```

**4. Copy bdsd-io.service file**

```bash
$ cp ~/bdsd-io/bdsd-io.service ~/.config/systemd/user
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