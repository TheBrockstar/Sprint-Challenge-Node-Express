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
// =====- Project Database Error Messages -=====
const unableToGetProjectList = {errorMessage: "Unable to retrieve projects."}

// =====- Action Database Error Messages -=====
const unableToGetActionList = {errorMessage: "Unable to retrieve actions."}


//// ==========- Project Database Endpoints -==========

/// ##### READ All Projects Endpoint #####

server.get('/api/projects', (request, response) => {

    // Database Helper Promise Method
    projectDb.get()
    .then(projects => response.status(200).send(projects))
    .catch(() => response.status(500).send(unableToGetProjectList))
});



//// ==========- Action Database Endpoints -==========

/// ##### READ All Actions Endpoint #####
server.get('/api/actions', (request, response) => {

    // Database Helper Promise Method
    actionDb.get()
    .then(actions => response.status(200).send(actions))
    .catch(() => response.status(500).send(unableToGetActionList))
});



/// Server Port and Listen Method
const port = 4242;
server.listen(port, () => console.log(`\n|/|/| PROJECTS SERVER ACTIVE ON PORT ${port} |\\|\\|\n`));