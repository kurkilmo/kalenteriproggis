const { userExtractor } = require('../middleware.js')
const database = require('../database.js')

const router = require('express').Router()

// userExtractor haistaa kirjautuneen käyttäjän pyynnöistä
router.use(userExtractor)

// Listaa ryhmän tapahtumat
router.get('/:id/events', async (request, response) => {
    const id = request.params.id
    const events = await database.getEventsByGroupID(id)
    //console.log(events)
    if (events) {
        response.json(events)
    } else {
        response.status(404).end()
    }
})


// Listaa ryhmät
router.get('/', async (request, response) => {
    const groups = await database.getGroups()
    //console.log(groups)
    response.json(groups)
})

// Luo ryhmä
router.post('/', (request, response) => {

})

// Hae ryhmä ID:llä
router.get('/:id', async (request, response) => {
    const group = await database.getGroupById(request.params.id)
    response.json(group)
})

// Hae ryhmän tapahtumat
router.get('/:id/events', async (request, response) => {
    const events = await database.getEventsByGroupID(request.params.id)
    response.json(events)
})

module.exports = router