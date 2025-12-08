const orgRouter = require('express').Router()
const {organizations} = require('../organizations')
const { createUserEvent } = require('../database')
const { userExtractor } = require('../middleware')

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

// Yhden organisaatiotapahtuman tuonti käyttäjän omaan kalenteriin
orgRouter.post('/:orgName/events/import', userExtractor, async (req, res) => {
    try {
        const userId = req.user.id; // userExtractor takaa että tämä on olemassa

        const { title, start, end, summary, color } = req.body;

        await createUserEvent(userId, {
            title,
            start,
            end,
            summary,
            color,
        });

        res.status(201).json({ ok: true });
    } catch (err) {
        console.error('Failed to import org event', err);
        res.status(500).json({ error: 'Failed to import event' });
    }
});

module.exports = orgRouter
