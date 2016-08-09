import DebugLib from 'debug';
import socketIO from 'socket.io';
import os from 'os';

var io;
var stats = {
  started : new Date().toUTCString()
};
function collectServerStat()
{
    stats['memory'] = process.memoryUsage();
    stats['cpu'] = os.loadavg();
    if (io)
      io.sockets.in("/server").emit('stats', stats);
}
setInterval(collectServerStat, 3000);

var sendingLogMessage = false;
export function log(message)
{
    if (io && !sendingLogMessage)
    {
      // prevent infintive loop if socket io is in DEBUG enviroment.
      sendingLogMessage = true;
      io.sockets.in('/debug').emit('log', message);
      sendingLogMessage = false;
    }

    console.log(message);
}

DebugLib.log = log;
export function createServer(server)
{
  io = socketIO(server);

  io.on('connection', (socket) => {
    console.log('Client connected');

    socket.on('subscribe', function (url) {
      console.log('Client subscribe on ' + url);
      socket.join(url);
      socket.emit(url, "subscribe");
    });

    socket.on('unsubscribe', function (url) {
      console.log('Client unsubscribe on ' + url);
      socket.leave(url);
      socket.emit(url, "unsubscribe");
    });

    socket.on('disconnect', () => console.log('Client disconnected'));
  });

  return io;
}
