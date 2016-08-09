import DebugLib from 'debug';
import socketIO from 'socket.io';
import os from 'os';
import {cache, pending} from '../cache';

var io;
var debug = DebugLib('web');
var counters = {
  'request' : 0
};
var stats = {
  started : new Date().toUTCString(),
};

/**
 * Collect all data to send back to the client throught webSocket.
 */
function collectServerStat()
{
    stats['cache'] = cache.size;
    stats['pending'] = pending.size;
    stats['request'] = counters.request;
    stats['memory'] = process.memoryUsage();
    stats['cpu'] = os.loadavg();
    if (io)
      io.sockets.in("/server").emit('stats', stats);
}
setInterval(collectServerStat, 3000);

var sendingLogMessage = false;
/**
 * Send log message to client 
 * 
 * @export
 * @param {any} message
 */
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

// override DEBUG log function and use our own to send to client.
DebugLib.log = log;


/**
 * register middleware.
 * 
 * @export
 * @param {any} app
 */
export function register(app)
{
  app.use(function (req, res, next) {
    debug(req.method + " " + req.url);
    counters.request++;
    next();
  });
}

/**
 * 
 * 
 * @export
 * @param {object} server Express Server instance to upgrade protocol to WebSocket.
 * @returns
 */
export function listen(server)
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
