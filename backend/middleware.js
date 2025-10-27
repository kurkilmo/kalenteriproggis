const jwt = require('jsonwebtoken')
const database = require('./database')

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

const userExtractor = async (req, res, next) => {
    const token = req.cookies.token
    if (!token) {
        return res.status(401).json({
            error: "no authorization provided"
        })
    }
    const decodedToken = jwt.verify(token, process.env.SECRET)
    if (!decodedToken.id) {
        return res.status(401).json({ error: 'invalid token' })
    }
    const user = await database.getUser(decodedToken.id)
    req.user = user
    next()
}

const errorHandler = (error, request, response, next) => {
    logger.error(error.message)

    if (error.name === 'JsonWebTokenError') {
        return response.status(401).json({ error: 'token missing or invalid' })
    }

    next(error)
}

module.exports = {
    unknownEndpoint,
    errorHandler,
    userExtractor
}