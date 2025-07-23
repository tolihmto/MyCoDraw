const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const path = require('path');
const fs = require('fs');
const { execFile } = require('child_process');


const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const DEFAULT_PORT = 3001;
const MAX_ATTEMPTS = 10;
const net = require('net');
const { exit } = require('process');

function findFreePort(startPort, attempts, cb) {
  let port = startPort;
  function tryPort() {
    const tester = net.createServer()
      .once('error', err => {
        if (err.code === 'EADDRINUSE') {
          port++;
          if (port < startPort + attempts) {
            tryPort();
          } else {
            cb(new Error('No free ports'));
          }
        } else {
          cb(err);
        }
      })
      .once('listening', () => {
        tester.close(() => cb(null, port));
      })
      .listen(port);
  }
  tryPort();
}

findFreePort(process.env.PORT ? parseInt(process.env.PORT) : DEFAULT_PORT, MAX_ATTEMPTS, (err, PORT) => {
  if (err) {
    console.error('Could not find a free port:', err);
    process.exit(1);
  }

  // Register this server instance with the backend API at startup, passing the chosen PORT
  let registrationProcess = execFile('node', [path.join(__dirname, 'registerServer.js'), PORT], { stdio: 'ignore', detached: false }, (error, stdout, stderr) => {
    if (error) {
      console.error('[REGISTER] Error registering game server:', error);
      return;
    }
    if (stdout) console.log(stdout.trim());
    if (stderr) console.error(stderr.trim());
  });

  // Middleware to serve static files
  app.use(express.static(path.join(__dirname, 'public')));

  // Store connected clients
  let clients = [];

  // WebSocket connection handling
  wss.on('connection', (ws) => {
    clients.push(ws);
    console.log('New client connected');

    ws.on('message', (message) => {
        // Broadcast incoming message to all clients
        clients.forEach(client => {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        });
    });

    ws.on('close', () => {
        clients = clients.filter(client => client !== ws);
        console.log('Client disconnected');
    });
  });

  // Start the server
  server.listen(PORT, () => {
    console.log(`Game server is running on http://localhost:${PORT}`);
  });

  // Graceful shutdown: delete server from backend
  const fs = require('fs');
  const axios = require('axios');
  const config = require('./config.json');
  const backendApiBase = config.backendApiUrl ? config.backendApiUrl.replace(/\/create$/, '') : 'http://localhost:5000/api/servers';

  async function cleanupServer() {
    try {
      const serverIdFile = `.serverid-${PORT}`;
      if (fs.existsSync(serverIdFile)) {
        const serverId = fs.readFileSync(serverIdFile, { encoding: 'utf-8' }).trim();
        if (serverId) {
          await axios.delete(`${backendApiBase}/${serverId}`);
          console.log(`[CLEANUP] Game server ${serverId} deleted from backend.`);
        }
        fs.unlinkSync(serverIdFile);
      }
    } catch (err) {
      console.error('[CLEANUP] Failed to delete game server from backend:', err.response?.data || err.message);
    }
  }

  function shutdownHandler() {
    cleanupServer().finally(() => {
      if (registrationProcess) {
        try {
          registrationProcess.kill();
        } catch(e) {}
      }
      process.exit(0); // Force exit after cleanup
    });
  }
  process.on('SIGINT', shutdownHandler);
  process.on('SIGTERM', shutdownHandler);
  process.on('exit', () => { cleanupServer(); });
});