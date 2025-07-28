// Hostinger Node.js Startup File
const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const path = require('path');

// Hostinger environment
const dev = false; // Always production on Hostinger
const hostname = '0.0.0.0'; // Listen on all interfaces
const port = process.env.PORT || 3000;

console.log('🚀 Starting Goldium DApp on Hostinger...');
console.log('Environment:', process.env.NODE_ENV || 'production');
console.log('Port:', port);

const app = next({ 
  dev, 
  hostname, 
  port,
  dir: __dirname
});

const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer(async (req, res) => {
    try {
      // Add CORS headers for Solana
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
      
      if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
      }
      
      const parsedUrl = parse(req.url, true);
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error('Error occurred handling', req.url, err);
      res.statusCode = 500;
      res.end('Internal server error');
    }
  })
  .once('error', (err) => {
    console.error('Server error:', err);
    process.exit(1);
  })
  .listen(port, hostname, () => {
    console.log(`✅ Goldium DApp ready on http://${hostname}:${port}`);
    console.log('🌐 Accessible at your Hostinger domain');
  });
}).catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});