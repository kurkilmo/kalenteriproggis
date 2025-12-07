const { userExtractor } = require('../middleware.js')
const database = require('../database.js')

const router = require('express').Router()

const db = require('../database.js');

// userExtractor haistaa kirjautuneen käyttäjän pyynnöistä
router.use(userExtractor)

// Listaa ryhmän tapahtumat
router.get('/:id/events', async (request, response) => {
    const id = request.params.id
    const events = await database.getEventsByGroupID(id)

    if (events) {
        response.json(events)
    } else {
        response.status(404).end()
    }
})


// Listaa ryhmät
router.get('/', async (request, response) => {
    const groups = await database.getGroups()

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
router.post('/:id/members', async (request, response) => {
    const userId = request.user.id
    const groupId = request.params.id
    const newUserId = request.body?.userId
    if (!newUserId) {
        return response.status(400).json({error: "No new userId provided"})
    }

    const group = await database.getGroupById(groupId)
    if (!group) {
        return response.status(404).json({
            error: `Group id ${groupId} not found`
    })}

    if (group.owner_id !== userId) {
        return response.status(403).json({
            error: "You are not the group's owner"
    })}

    try {
        await database.addUserToGroup(groupId, newUserId)
    } catch (error) {
        if (error.message.includes("Duplicate entry")) {
            return response.status(403).json({error: "User is already a member of the group"})
        }
    }
    response.status(201).send()
})

// Hae ryhmä ID:llä
router.get('/:id', async (request, response) => {
    const group = await database.getGroupById(request.params.id)
    response.json(group)
})

router.delete('/:id', async (request, response) => {
    const groupId = request.params.id
    const userId = request.user.id
    const group = await database.getGroupById(groupId)
    if (!group) {
        return response.status(404).send()
    }

    if (group.owner_id !== userId) {
        return response.status(403).json({error: "You don't own this grop"})
    }

    await database.deleteGroup(groupId)
    return response.status(204).send()
})

// Hae ryhmän tapahtumat
router.get('/:id/events', async (request, response) => {
    const events = await database.getEventsByGroupID(request.params.id)
    response.json(events)
})

router.post('/:id/events', async (request, response) => {
    const user = request.user
    const newEvent = request.body
    if (!newEvent) return response.status(400).json({
        error: "No body provided"
    })

    const group = await database.getGroupById(request.params.id)

    const groupUserIds = await database.getGroupMemberIds(group.id)
    if (!groupUserIds.includes(user.id)) {
        return response.status(403).json({
            error: "You don't have permission to publish to this group"
        })
    }

    try {
        const res = await database.postGroupEvent(
            group.id, newEvent
        )
    } catch (error) {
        if (error.message.startsWith("err:")) {
            return response.status(400).json({
                error: error.message.replace("err:", "")
            })
        }
        return response.status(500).json({
            error: error.message
        })
    }
    response.status(201).send()

    return response.status(501).send()
})

// Hae ryhmän jäsenten varatut ajat
router.get("/:groupId/external-busy", async (req, res) => {
  try {
    const data = await db.getExternalBusyByGroupId(req.params.groupId);
    res.json(data);
  } catch (err) {
    console.error("External busy error:", err);
    res.status(500).json({ error: "Could not fetch external busy slots" });
  }
});

module.exports = router