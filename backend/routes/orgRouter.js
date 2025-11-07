const orgRouter = require('express').Router()
const {organizations} = require('../organizations')

// Iteroidaan olemassa olevat orgit reiteiks
organizations.forEach(org => {
    const orgName = org["name"]
    orgRouter.get(`/${orgName}/events`, async (req, res) => {
        const eventsGetter = org["getEvents"]
        if (!eventsGetter) {
            return res.status(404)
        }
        const events = await eventsGetter()
        res.json(events)
    })
    orgRouter.get(`/${orgName}/`, async (req, res) => {
        res.json(org)
    })
})

orgRouter.get('/', (req, res) => {
    res.json(organizations.map(org =>
        // Tää poistaa getEvents-keyn:
        (({getEvents, ...o}) => o)(org)
    ))
})

module.exports = orgRouter
