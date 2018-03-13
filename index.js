// require socket.io
const PORT = 49199;
const io = require('socket.io')(PORT);

// require bdsd.client
const bdsd = require('bdsd.client')();

io.on('connection', socket => {
  console.log('user connected');
  // register socket.io events
  socket.on('get datapoints', callback => {
    bdsd
      .getDatapoints()
      .then(payload => {
        callback(null, payload);
      })
      .catch(e => {
        callback(e);
      })
  });
  socket.on('get description', (id, callback) => {
    bdsd
      .getDescription(id)
      .then(payload => {
        callback(null, payload);
      })
      .catch(e => {
        callback(e);
      })
  });
  socket.on('get value', (id, callback) => {
    bdsd
      .getValue(id)
      .then(payload => {
        callback(null, payload);
      })
      .catch(e => {
        callback(e);
      })
  });
  socket.on('set value', (id, value, callback) => {
    bdsd
      .setValue(id, value)
      .then(payload => {
        callback(null, payload);
      })
      .catch(e => {
        callback(e);
      })
  });
  socket.on('read value', (id, callback) => {
    bdsd
      .readValue(id)
      .then(payload => {
        callback(null, payload);
      })
      .catch(e => {
        callback(e);
      })
  });
});

// broadcast value indication
bdsd.on('value', data => {
  io.emit('value', data);
});

