const meRouter = require('express').Router()
const database = require('../database.js')
const { userExtractor } = require('../middleware.js')

// userExtractor haistaa kirjautuneen käyttäjän pyynnöistä
meRouter.use(userExtractor)

meRouter.get('/', (request, response) => {
    response.status(200).send(request.user)
})

meRouter.get('/events', async (request, response) => {
    const events = await database.getEventsByUserId(
        request.user.id
    )
    response.json(events)
})

meRouter.get('/groups', async (request, response) => {
    const groups = await database.getGroupsByUserId(
        request.user.id
    )
    response.json(groups)
})

meRouter.get('/settings', async (request, response) => {
    const settings = await database.getUserSettings(
        request.user.id
    )
    response.json(settings)
})

meRouter.patch('/settings', async (request, response) => {
    const {settingsKey, settingsValue } = request.body;

    try {
        const results = await database.updateUserSettings(request.user.id, settingsKey, settingsValue)
        response.json(results)
    } catch (error) {
        response.status(500).json({ error: 'Patch request failed' })
    }
})

module.exports = meRouter