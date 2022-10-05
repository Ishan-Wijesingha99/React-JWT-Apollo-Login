
const { AuthenticationError } = require('apollo-server')


const jwt = require('jsonwebtoken')


module.exports = (context) => {
    // context = { ... headers }
    const authHeader = context.req.headers.authorization

    if(authHeader == null) return new Error("Authentication header must be provided")

    const token = authHeader.split(' ')[1]

    if(token == null) return new Error("Authentication token must be Bearer [token]")

    // now that we've got through all those checks, it's time verify the jwt
    const user = jwt.verify(token, process.env.TOKEN_SECRET_KEY, (err, data) => {
        if(err) return new AuthenticationError('Invalid/Expired token')

        const user = data
        return user
    })
}