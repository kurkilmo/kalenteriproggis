const database = require('../database.js')
const bcrypt = require('bcrypt')
const userRouter = require('express').Router()

const saltRounds = parseInt(process.env.SALTROUNDS || "67")

// List users

userRouter.get('/', async (request, response) => {
    const users = await database.getUsers()
    response.json(users)
})

// Create User
userRouter.post('/', async (request, response) => {
    const { username, password } = request.body

    const hash = await bcrypt.hash(password, saltRounds)

    let result
    try {
        result = await database.createUser(username, hash)
    } catch (error) {
        const userExistsPat = /Duplicate entry '.*' for key 'username'/
        if (userExistsPat.test(error.message)) {
            return response.status(403).json({
                error: `user exists`,
                username
            })
        }
    }

    const createdUser = await database.getUser(result.insertId)

    response.status(201).json(createdUser)
})

// Get an user
userRouter.get('/:id', async (request, response) => {
    const id = request.params.id
    const user = await database.getUser(id)
    if (user) {
        response.json(user)
    } else {
        response.status(404).end()
    }
    
})

module.exports = userRouter
