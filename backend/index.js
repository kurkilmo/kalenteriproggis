const database = require('./database.js')
const middleware = require('./middleware.js')
const express = require('express')
const app = express()

/** Sallitaan Cross Origin Request */
const cors = require('cors')
app.use(cors({
    origin: "http://localhost:8081",
    credentials: true
}))
app.use(express.json())

const cookieparser = require('cookie-parser')
app.use(cookieparser())

/*
Tutoriaali:
 Node.js ja Express:    https://fullstackopen.com/osa3/node_js_ja_express
 MySQL Node.js Express: https://www.youtube.com/watch?v=Hej48pi_lOc
*/


// -------- USERS --------------
const userRouter = require('./routes/userRouter.js')
app.use('/api/users', userRouter)

const loginRouter = require('./routes/loginRouter.js')
app.use('/api/login', loginRouter)

const meRouter = require('./routes/meRouter.js')
app.use('/api/me', meRouter)


// -------- EVENTS --------------

// Listaa tapahtumat
app.get('/api/events', async (request, response) => {
    const events = await database.getEvents()
    response.json(events)
})

// Listaa ryhmän tapahtumat
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

// Listaa käyttäjän tapahtumat
app.get('/api/users/me/events', async (request, response) => {
    
})

// Luo tapahtuma
app.post('/api/events', (request, response) => {
    
})

// Hae tapahtuma ID:llä
app.get('/api/events/:id', (request, response) => {

})

// -------- GROUPS --------------

// Listaa ryhmät
app.get('/api/groups', async (request, response) => {
    const groups = await database.getGroups()
    //console.log(groups)
    response.json(groups)
})

// Luo ryhmä
app.post('/api/groups', (request, response) => {

})

// Hae ryhmä ID:llä
app.get('/api/groups/:id', async (request, response) => {
    const group = await database.getGroupById(request.params.id)
    response.json(group)
})

// Hae ryhmän tapahtumat
app.get('/api/groups/:id/events', async (request, response) => {
    const events = await database.getEventsByGroupID(request.params.id)
    response.json(events)
})

// -------- ORGS --------
const orgRouter = require('./routes/orgRouter.js')

app.use('/api/orgs', orgRouter)

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})