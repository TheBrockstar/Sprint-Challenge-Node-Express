// Node Dependencies
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');

// Database Helpers
const projectDb = require('./data/helpers/projectModel');
const actionDb = require('./data/helpers/actionModel');

// Instantiate Server
const server = express();

// Implement Server-wide Middleware
server.use(express.json(), cors(), morgan('combined'), helmet());

///// ===============- SERVER CRUD ENDPOINTS -===============

/// ##### Error Messages #####
const unableToGetProjectList = {errorMessage: "Unable to retrieve projects."}

/// ##### READ All Projects Endpoint #####
server.get('/api/projects', (request, response) => {
    projectDb.get()
    .then(projects => response.status(200).send(projects))
    .catch(() => response.status(500).send(unableToGetProjectList))
});

/// Server Port and Listen Method
const port = 4242;
server.listen(port, () => console.log(`\n|/|/| PROJECTS SERVER ACTIVE ON PORT ${port} |\\|\\|\n`));