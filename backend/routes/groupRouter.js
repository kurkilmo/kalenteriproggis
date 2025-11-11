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
router.post('/', async (request, response) => {
    const ownerId = request.user.id
    const name = request.body?.name
    if (!name) {
        return response.status(400).json({error: "No group name provided"})
    }

    await database.createGroup(name, ownerId)
    response.status(201).send()
})

// Lisää ryhmään jäsen
router.post('/:id', async (request, response) => {
    const userId = request.user.id
    const groupId = request.params.id
    const newUserId = request.body?.userId
    if (!newUserId) {
        return response.status(400).json({error: "No new userId provided"})
    }

    const group = await database.getGroupById(groupId)
    console.log(group)
    if (!group) {
        return response.status(404).json({
            error: `Group id ${groupId} not found`
    })}
    console.log(group.owner_id)
    console.log(userId)
    if (group.owner_id !== userId) {
        return response.status(403).json({
            error: "You are not the group's owner"
    })}

    await database.addUserToGroup(groupId, newUserId)
    response.status(201).created()
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