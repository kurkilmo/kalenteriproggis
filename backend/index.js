const database = require('./database.js')
const express = require('express')
const app = express()

/*
Tutoriaali:
 Node.js ja Express:    https://fullstackopen.com/osa3/node_js_ja_express
 MySQL Node.js Express: https://www.youtube.com/watch?v=Hej48pi_lOc
*/


// -------- USERS --------------

// List users
app.get('/api/users', async (request, response) => {
    const users = await database.getUsers()
    response.send(users)
})

// Create User
app.post('/api/users', (request, response) => {
    const { username } = request.body

    const result = database.createUser(username)
    const createdUser = getUser(result.id)
    response.status(201).send(createdUser)
})

// Get an user
app.get('/api/users/:id', async (request, response) => {
    const id = request.params.id
    const user = await database.getUser(id)
    if (user) {
        response.send(user)
    } else {
        response.status(404).end()
    }
    
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