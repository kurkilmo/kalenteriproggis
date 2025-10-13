
const express = require('express')
const app = express()

/*
Tutoriaali:
 Node.js ja Express:    https://fullstackopen.com/osa3/node_js_ja_express
 MySQL Node.js Express: https://www.youtube.com/watch?v=Hej48pi_lOc
*/


// -------- USERS --------------

// List users
app.get('/api/users', (request, response) => {
    response.status(404).end()
})

// Create User
app.post('/api/users', (request, response) => {
    
})

// Get an user
app.get('/api/users/:id', (request, response) => {

})

// -------- EVENTS --------------

// List events
app.get('/api/events', (request, response) => {

})

// Create Event
app.post('/api/events', (request, response) => {
    
})

// Get an event
app.get('/api/events/:id', (request, response) => {

})

// -------- GROUPS --------------

// List groups
app.get('/api/groups', (request, response) => {

})

// Create a group
app.post('/api/groups', (request, response) => {
    
})

// Get a group
app.get('/api/groups/:id', (request, response) => {

})


const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})