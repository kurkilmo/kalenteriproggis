const database = require('./database.js')
const express = require('express')
const app = express()

/** Sallitaan Cross Origin Request */
const cors = require('cors')
app.use(cors())

app.use(express.json())

/*
Tutoriaali:
 Node.js ja Express:    https://fullstackopen.com/osa3/node_js_ja_express
 MySQL Node.js Express: https://www.youtube.com/watch?v=Hej48pi_lOc
*/


// -------- USERS --------------

// List users
app.get('/api/users', async (request, response) => {
    const users = await database.getUsers()
    response.json(users)
})

// Create User
app.post('/api/users', (request, response) => {
    const { username } = request.body

    const result = database.createUser(username)
    const createdUser = getUser(result.id)
    response.status(201).json(createdUser)
})

// Get an user
app.get('/api/users/:id', async (request, response) => {
    const id = request.params.id
    const user = await database.getUser(id)
    if (user) {
        response.json(user)
    } else {
        response.status(404).end()
    }
    
})

// -------- EVENTS --------------

// List events
app.get('/api/events', (request, response) => {

})

// List a groups events
app.get('/api/groups/:id/events', async (request, response) => {
    const id = request.params.id
    const events = await database.getEventsByGroupID(id)
    //console.log(events)
    if (events) {
        response.json(events)
    } else {
        response.status(404).end()
    }
})

// Create Event
app.post('/api/events', (request, response) => {
    
})

// Get an event
app.get('/api/events/:id', (request, response) => {

})

// -------- GROUPS --------------

// List groups
app.get('/api/groups', async (request, response) => {
    const groups = await database.getGroups()
    //console.log(groups)
    response.json(groups)
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