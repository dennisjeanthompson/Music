const express = require('express');
const path = require('path');
const trackRoutes = require('./routes/tracks');
const db = require('./models/db');
const { findAvailablePort } = require('./utils/portHandler');

const app = express();
const startPort = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Set view engine
app.set('view engine', 'ejs');

// Routes
app.use('/', trackRoutes);

// Initialize database and start server
async function startServer() {
  try {
    await db.initializeDatabase();
    const port = await findAvailablePort(startPort);
    
    app.listen(port, () => {
      console.log(`Server running at http://localhost:${port}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

startServer();