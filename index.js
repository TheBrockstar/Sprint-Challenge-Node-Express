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
const noProjectsWereDeleted = { errorMessage: "No projects were deleted" }
const unableToGetProjectList500 = { errorMessage: "Unable to retrieve projects." }
const unableToGetProject500 = { errorMessage: "Unable to retrieve project with the specified project Id." }
const unableToCreateProject500 = { errorMessage: "Unable to create project."}
const unableToUpdateProject500 = { errorMessage: "Unable to update project."}
const unableToDeleteProject500 = { errorMessage: "Unable to delete project."}

// =====- Action Database Error Messages -=====
const unableToFindActionWithId = { errorMessage: "Unable to find a project with the specified action Id." }
const missingActionData = { errorMessage: "Please provide notes and a description when creating an action." }
const unableToGetActionList500 = { errorMessage: "Unable to retrieve actions." }
const unableToGetAction500 = { errorMessage: "Unable to retrieve project with the specified action Id." }
const unableToCreateAction500 = { errorMessage: "Unable to create action."}
const unableToUpdateAction500 = { errorMessage: "Unable to update action."}


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

/// ##### UPDATE Individual Project Endpoint #####
server.put('/api/projects/:projectId', (request, response) => {

    // Extract URL Parameters
    const projectId = request.params.projectId;

    // Deconstruct Request Body
    let { name, description, completed } = request.body;

    // Construct Updated Project Body
    let updatedProject = {};

    if ( name ) {
        updatedProject.name = name;
    }

    if ( description ) {
        updatedProject.description = description;
    }

    if ( completed ) {
        updatedProject.completed = completed;
    }

    // Database Helper Promise Methods
    projectDb.update(projectId, updatedProject)
    .then( project => {
        if ( !project ) {
            return response.status(404).send(unableToFindProjectWithId)
        }

        response.status(200).send(project);
    })
    .catch(() => response.status(500).send(unableToUpdateProject500))
});


/// ##### DELETE Individual Project Endpoint #####

server.delete('/api/projects/:projectId',  (request, response) => {

    // Extract URL Parameters
    const projectId = request.params.projectId;

    // Database Helper Promise Methods

    projectDb.get(projectId)
    .then( project => { 
        
        if ( !project ) { 
            // Possibly unreachable
            return response.status(404).send(unableToFindProjectWithId)
        }

        projectDb.remove(projectId)
        .then( wasDeleted => {
            if ( !wasDeleted ) {
                return response.status(204).send(noProjectsWereDeleted);
            }
            response.status(200).send(project);
        })
        .catch(() => response.status(500).send(unableToDeleteProject500))
    })
    .catch(() => response.status(500).send(unableToGetProject500))
});



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

/// ##### CREATE Individual Action Endpoint #####
server.post('/api/projects/:projectId/actions', (request, response) => {

    // Extract URL Parameter
    const projectId = request.params.projectId;

    // Deconstruct Request Body
    let { description, notes, completed } = request.body;

    // Request Validation

    if ( !description || !notes) {
        return response.status(400).send(missingActionData);
    }

    if ( !completed ) {
        completed = false;
    }

    // Database Helper Promise Methods

    // Check To See If Project With Received Project Id Exists
    projectDb.get(projectId)
    .then( project => { 
        if ( !project ) { 
            // Possibly unreachable
            return response.status(404).send(unableToFindProjectWithId)
        }

        // Construct New Action Object
        const newAction = { "project_id": projectId, "description": description, "notes": notes, "completed": completed };

        actionDb.insert(newAction)
        .then(action => response.status(201).send(action))
        .catch(() => response.status(500).send(unableToCreateAction500))
    })
    .catch(() => response.status(500).send(unableToGetProject500))
});

/// ##### UPDATE Individual Action Endpoint #####
server.put('/api/actions/:actionId', (request, response) => {

    // Extract URL Parameters
    const actionId = request.params.actionId;

    // Deconstruct Request Body
    let { description, notes, completed } = request.body;

    // Construct Updated Project Body
    let updatedAction = {};

    if ( description ) {
        updatedAction.description = description;
    }

    if ( notes ) {
        updatedAction.notes = notes;
    }

    if ( completed ) {
        updatedAction.completed = completed;
    }

    // Database Helper Promise Methods
    actionDb.update(actionId, updatedAction)
    .then( action => {
        if ( !action ) {
            return response.status(404).send(unableToFindActionWithId)
        }

        response.status(200).send(action);
    })
    .catch(() => response.status(500).send(unableToUpdateAction500))
});


/// ##### DELETE Individual Project Endpoint #####

server.delete('/api/actions/:actionId',  (request, response) => {

    // Extract URL Parameters
    const actionId = request.params.actionId;

    // Database Helper Promise Methods

    actionDb.get(actionId)
    .then( action => { 
        
        if ( !action ) { 
            // Possibly unreachable
            return response.status(404).send(unableToFindActionWithId)
        }

        actionDb.remove(actionId)
        .then( wasDeleted => {
            if ( !wasDeleted ) {
                return response.status(204).send(noActionsWereDeleted);
            }
            response.status(200).send(action);
        })
        .catch(() => response.status(500).send(unableToDeleteAction500))
    })
    .catch(() => response.status(500).send(unableToGetAction500))
});



/// Server Port and Listen Method
const port = 4242;
server.listen(port, () => console.log(`\n|/|/| PROJECTS SERVER ACTIVE ON PORT ${port} |\\|\\|\n`));