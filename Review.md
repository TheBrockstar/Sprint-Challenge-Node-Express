# Review Questions

## What is Node.js?
- Node.js is a platform for developing asynchronous network and server-side 
applications.

## What is Express?
- Express is a Node.js framework for building servers for use in web 
applications.

## Mention two parts of Express that you learned about this week.
1. Routing 
2. The ability to easily connect Middleware.

## What is Middleware?
- Middlware is a piece of code that executes between when data is received 
and when it is passed to a final destination.

## What is a Resource?
- A resource is anything that we might make accessible with an API.

## What can the API return to help clients know if a request was successful?
- An API can return a Status Code (Like 500 or 404 if the request was not 
successful, or 200 if it was... among others).

## How can we partition our application into sub-applications?
- We can partition our application into sub-applications with express router. 
Basically, instead of having one main server with all of our routes in it, we 
can divide up our routes into routers that contain similar routes and then
export them to our server and have the server use them.

## What is express.json() and why do we need it?
- express.json() is express middleware that parses requests to the server with JSON content also sends the server's responses as JSON.
