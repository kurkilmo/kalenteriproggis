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
    const settingsKey = request.body.key;   // Avain eli theme, language, timezone
    const settingsValue = request.body.value;
    console.log("Patch request (user: settings) received with values: ", request.body, settingsKey, settingsValue);

    try {
        const results = await database.patchUserSettings(request.user.id, `$.${settingsKey}`, settingsValue)
        console.log("results: ", results)
        response.json(results)
    } catch (error) {
        console.error("error: ", error.message)
        response.status(500).json({ error: 'Patch request failed' })
    }
})

meRouter.patch('/displayname', async (request, response) => {
    const userValue = request.body.value;
    
    console.log("Patch request (user: displayname) received with values: ", request.body, userValue);

    try {
        const results = await database.patchUserDisplayname(request.user.id, userValue)
        console.log("results: ", results)
        response.json(results)
    } catch (error) {
        console.error("error: ", error.message)
        response.status(500).json({ error: 'Patch request failed' })
    }
})

module.exports = meRouter