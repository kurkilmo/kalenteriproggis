const orgRouter = require('express').Router()
const {organizations} = require('../organizations')

// Iteroidaan olemassa olevat orgit reiteiks
Object.keys(organizations).forEach(org => {
    orgRouter.get(`/${org}`, async (req, res) => {
        const eventsGetter = organizations[org]["getEvents"]
        if (!eventsGetter) {
            return res.status(404)
        }
        const events = await eventsGetter()
        res.json(events)
    })
})

module.exports = orgRouter