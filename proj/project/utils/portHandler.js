const net = require('net');

function findAvailablePort(startPort, maxPort = startPort + 10) {
  return new Promise((resolve, reject) => {
    function tryPort(port) {
      if (port > maxPort) {
        reject(new Error('No available ports found'));
        return;
      }

      const server = net.createServer();
      
      server.once('error', (err) => {
        if (err.code === 'EADDRINUSE') {
          tryPort(port + 1);
        } else {
          reject(err);
        }
      });

      server.once('listening', () => {
        server.close(() => resolve(port));
      });

      server.listen(port);
    }

    tryPort(startPort);
  });
}

module.exports = { findAvailablePort };