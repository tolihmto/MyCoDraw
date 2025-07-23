// Script to register this game server instance to the backend API
const axios = require('axios');
const config = require('./config.json');
const { exit } = require('process');

(async () => {
  try {
    // Accept port as argument for uniqueness
    const portArg = process.argv[2];
    const port = portArg ? parseInt(portArg) : (config.port || process.env.PORT || 3001);
    const serverName = `GameServer-${port}`;
    const maxPlayers = config.maxPlayers || 8;
    const backendApiBase = config.backendApiUrl ? config.backendApiUrl.replace(/\/create$/, '') : 'http://localhost:5000/api/servers';
    // Remove any existing server with the same name before creating
    try {
      await axios.delete(`${backendApiBase}/by-name/${encodeURIComponent(serverName)}`);
    } catch (deleteErr) {
      // Ignore if not found
    }
    try {
      const createRes = await axios.post(`${backendApiBase}/create`, {
        name: serverName,
        maxPlayers
      });
      console.log('[REGISTER] Game server registered with backend:', createRes.data);
      // Write server ID to .serverid-<PORT>
      const fs = require('fs');
      const serverId = createRes.data.server?._id || createRes.data._id;
      if (!serverId) {
        console.error('[REGISTER] No serverId found in backend response:', createRes.data);
      } else {
        fs.writeFileSync(`.serverid-${port}`, serverId, { encoding: 'utf-8' });
      }
    } catch (createErr) {
      console.error('[REGISTER] Failed to register game server:', createErr.response?.data || createErr.message);
    }
  } catch (err) {
    console.error('[REGISTER] Unexpected error:', err.message);
  }
  process.exit(0);
})();

