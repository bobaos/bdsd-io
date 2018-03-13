// replace ip address here
const socket = require('socket.io-client')('http://192.168.1.59:49199');

socket.on('connect', function () {
  console.log("connected");
});

// assuming that you have a bool datapoint 1
setInterval(_ => {
  socket.emit('get value', 1, function (err, payload) {
    if (err) {
      throw new Error(err);
    }
    console.log('got value', payload);
    socket.emit('set value', 1, !payload.value, function (err, payload) {
      if (err) {
        throw new Error(err);
      }
      console.log('set new value success', payload);
    });
  });
}, 3500);

socket.on('value', function (payload) {
  console.log('broadcasted value', payload);
});

