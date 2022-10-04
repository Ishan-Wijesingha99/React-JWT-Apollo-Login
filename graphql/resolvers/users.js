require('dotenv').config()

const User = require('../../models/User');
const { ApolloError } = require('apollo-server-errors')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

module.exports = {
    Mutation: {
        async registerUser(_, {registerInput: {username, email, password} }) {
            // see if old user exists already with the same email
            const oldUser = await User.findOne({ email })
            
            // throw error if that user exists
            if(oldUser) throw new ApolloError(`A user is already registered with the email ${email}`, 'USER_ALREADY_EXISTS')
        
            // encrypt password
            const encryptedPassword = await bcrypt.hash(password, 10)

            // add to mongoose model
            const newUser = new User({
                username: username,
                email: email.toLowerCase(),
                password: encryptedPassword
            })

            // create JWT (attach that to our User model)
            const token = jwt.sign({
                user_id: newUser._id,
                email: email.toLowerCase()
            }, process.env.TOKEN_SECRET_KEY, {
                expiresIn: "1h"
            })

            newUser.token = token

            // save user to MongoDB
            const res = await newUser.save()

            return {
                id: res.id,
                ...res._doc
            }
        }
    },
    Query: {
        // message: (_, {ID}) => Message.findById(ID)
    }
}