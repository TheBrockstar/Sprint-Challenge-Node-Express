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
const unableToFindProjectWithId = { errorMessage: "Unable to find a project with the specified project Id." }
const missingProjectData = { errorMessage: "Please provide a name and description when creating a project." }
const unableToGetProjectList500 = { errorMessage: "Unable to retrieve projects." }
const unableToGetProject500 = { errorMessage: "Unable to retrieve project." }
const unableToCreateProject500 = { errorMessage: "Unable to create project."}

// =====- Action Database Error Messages -=====
const unableToFindActionWithId = { errorMessage: "Unable to find a project with the specified action Id." }
const unableToGetActionList500 = { errorMessage: "Unable to retrieve actions." }
const unableToGetAction500 = { errorMessage: "Unable to retrieve action." }


//// ==========- Project Database Endpoints -==========

/// ##### READ All Projects Endpoint #####

server.get('/api/projects', (request, response) => {

    // Database Helper Promise Methods
    projectDb.get()
    .then( projects => response.status(200).send(projects))
    .catch(() => response.status(500).send(unableToGetProjectList500))
});


/// ##### READ Individual Project Endpoint #####

server.get('/api/projects/:projectId', (request, response) => {

    // Extract URL Parameter
    const projectId = request.params.projectId;

    // Database Helper Promise Methods
    projectDb.get(projectId)
    .then( project => { 
        if ( !project ) { 
            // Possibly unreachable
            return response.status(404).send(unableToFindProjectWithId)
        }
        response.status(200).send(project)
    })
    .catch(() => response.status(500).send(unableToGetProject500))
})


/// ##### CREATE Individual Project Endpoint #####

server.post('/api/projects', (request, response) => {

    // Deconstruct Request Body 
    let { name, description, completed } = request.body;

    // Request Validation
    if ( !name || !description ) {
        return response.status(400).send(missingProjectData)
    }

    if ( !completed ) {
        completed = false;
    }

    // Construct New Project Object
    const newProject = { "name": name, "description": description, "completed": completed };

    // Database Helper Promise Methods
    projectDb.insert(newProject)
    .then(project => response.status(201).send(project))
    .catch(() => response.status(500).send(unableToCreateProject500))
})



//// ==========- Action Database Endpoints -==========

/// ##### READ All Actions Endpoint #####
server.get('/api/actions', (request, response) => {

    // Database Helper Promise Methods
    actionDb.get()
    .then(actions => response.status(200).send(actions))
    .catch(() => response.status(500).send(unableToGetActionList500))
});

/// ##### READ Individual Action Endpoint #####
server.get('/api/actions/:actionId', (request, response) => {

    // Extract URL Parameter
    const actionId = request.params.actionId;

    // Database Helper Promise Methods
    actionDb.get(actionId)
    .then( action => { 
        if ( !action ) { 
            // Possibly unreachable
            return response.status(404).send(unableToFindActionWithId)
        }
        response.status(200).send(action)
    })
    .catch(() => response.status(500).send(unableToGetAction500))
});



/// Server Port and Listen Method
const port = 4242;
server.listen(port, () => console.log(`\n|/|/| PROJECTS SERVER ACTIVE ON PORT ${port} |\\|\\|\n`));