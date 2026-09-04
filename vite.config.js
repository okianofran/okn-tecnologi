import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import productsHandler from './api/products.js';
import categoriesHandler from './api/categories.js';
import ordersHandler from './api/orders.js';

function localApiPlugin() {
  return {
    name: 'local-api-plugin',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        // Polyfill status and json methods for Vercel handler compatibility in Vite dev
        if (!res.status) {
          res.status = function(code) {
            this.statusCode = code;
            return this;
          };
        }
        if (!res.json) {
          res.json = function(data) {
            this.setHeader('Content-Type', 'application/json');
            this.end(JSON.stringify(data));
            return this;
          };
        }

        const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
        if (url.pathname === '/api/products') {
          req.query = Object.fromEntries(url.searchParams);
          return await productsHandler(req, res);
        }
        if (url.pathname === '/api/categories') {
          req.query = Object.fromEntries(url.searchParams);
          return await categoriesHandler(req, res);
        }
        if (url.pathname === '/api/orders' && req.method === 'POST') {
          let body = '';
          req.on('data', chunk => { body += chunk; });
          req.on('end', async () => {
            try {
              req.body = JSON.parse(body);
            } catch (e) {
              req.body = {};
            }
            await ordersHandler(req, res);
          });
          return;
        }
        next();
      });
    }
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), localApiPlugin()],
  server: {
    port: 5173,
    host: true
  }
});