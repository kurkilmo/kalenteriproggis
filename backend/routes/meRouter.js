const meRouter = require('express').Router()
const database = require('../database.js')
const { userExtractor } = require('../middleware.js')

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

module.exports = meRouter