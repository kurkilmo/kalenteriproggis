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

meRouter.post('/events', async (request, response) => {
    const newEvent = request.body
    if (!newEvent) return response.status(400).json({
        error: "No body provided"
    })
    try {
        const res = await database.createUserEvent(
            request.user.id, newEvent
        )
    } catch(error) {
        if (error.message.startsWith("err:")) {
            return response.status(400).json({
                error: error.message.replace("err:","")
            })
        }
        return response.status(500).json({
            error: error.message
        })
    }
    response.status(201).send()
})

meRouter.delete('/events/:id', async (request, response) => {
    const event = await database.getEventById(request.params.id)

    if ((!event) || event.is_group_event) {
        return response.status(404).send()
    }
    if (event.owner_id !== request.user.id) {
        return response.status(403).json({error:"This is not your event"})
    }
    
    try {
        await database.deleteEvent(request.params.id)
    } catch {
        return response.status(500).send()
    }

    response.status(204).send()
})

meRouter.patch('/events/:id', async (request, response) => {
    const oldEvent = await database.getEventById(request.params.id)

    if (!oldEvent) {
        return response.status(404).json({error: "Event not found"})
    }
    if (oldEvent.is_group_event || oldEvent.owner_id !== request.user.id) {
        return response.status(403).json({ error: "This is not your event" })
    }

    // Bodyssä tuleva event ilman tiettyjä kenttiä
    const patchEvent = (({
        id, owner_id, is_group_event, ...o
    }) => o)(request.body)

    const newEvent = { ...oldEvent, ...patchEvent }

    try {
        await database.updateEvent(newEvent)
    } catch {
        return response.status(500).send()
    }
    response.status(201).send()
})

meRouter.get('/groups', async (request, response) => {
    const groups = await database.getGroupsByUserId(
        request.user.id
    )
    response.json(groups)
})

// Ryhmästä poistuminen
meRouter.delete('/groups/:id', async (request, response) => {
    const groupId = request.params.id
    const user = request.user
    await database.removeUserFromGroup(groupId, user.id)
    response.status(204).send()
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