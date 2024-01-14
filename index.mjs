import { Server } from 'socket.io'

// socket server
const PORT = 23222;
const io = new Server(PORT, {
  cors: {
    origin: 'http://led.luftaquila.io',
    method: ['GET', 'POST'],
    transports: ['websocket', 'polling'],
    credentials: true
  },
  allowEIO3: true
});

console.log("SERVER STARTUP");

let prop = { data: [] };

io.sockets.on("connection", socket => {
  if (socket.handshake.query.type == 'device') {
    console.log("DEVICE ONLINE");
    socket.join("device");

    socket.emit("update", prop);
  } else if (socket.handshake.query.type == 'client') {
    console.log("CLIENT ONLINE");

    socket.emit("init", prop);

    socket.on("sync", data => {
      console.log("PROP SYNC");

      prop = data;
      io.to('device').emit("update", prop);
    });
  }
});
