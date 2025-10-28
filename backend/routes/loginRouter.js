const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const database = require('../database.js')
const loginRouter = require('express').Router()

const secret = process.env.SECRET

function denyAccess(response) {
    response.status(401).json({
        error: "invalid username or password"
    })
}

loginRouter.post('/', async (request, response) => {
    const auth = request.headers.authorization
    const [username, password] = atob(auth.split(" ")[1]).split(":")
    console.log(username)
    console.log(password)

    const user = await database.getUserByUsername(username)
    console.log(user)
    if (!user) {
        return denyAccess(response)
    }
    const passwordsMatch = await bcrypt.compare(password, user.passhash)
    console.log(passwordsMatch)

    if (passwordsMatch) {
        const userForToken = (({ passhash, ...o }) => o)(user)
        console.log("userForToken:")
        console.log(userForToken)
        const token = jwt.sign(
            userForToken,
            secret
        )
        response.setHeader(
            "Set-Cookie",
            `token=${token}`
        )
        return response.status(200).send()
    }

    denyAccess(response)
})

module.exports = loginRouter
