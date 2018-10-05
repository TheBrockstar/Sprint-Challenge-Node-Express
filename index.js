// Node Dependencies
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');

// Database Helpers
const actionDb = require('./data/helpers/actionModel');
const projectDb = require('./data/helpers/projectModel');

// Instantiate Server
const server = express();

// Implement Server-wide Middleware
server.use(express.json(), cors(), morgan('combined'), helmet());

/// Server Port and Listen Method
const port = 4242;
server.listen(port, () => console.log(`\n|/|/| PROJECTS SERVER ACTIVE ON PORT ${port} |\\|\\|\n`));