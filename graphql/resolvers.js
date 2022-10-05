require('dotenv').config()

const User = require('../models/User')
const Message = require('../models/Message')

const { ApolloError } = require('apollo-server-errors')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const resolvers = {
    Query: {
        user: (_, {ID}) => User.findById(ID),
        message: (_, {ID}) => Message.findById(ID)
    },

    Mutation: {
        registerUser: async (_, {registerInput: {username, email, password} }) => {
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
        },

        createMessage: async (_, {messageInput: {text, username} }) => {
            const newMessage = new Message({
                text: text,
                createdBy: username,
                createdAt: new Date().toISOString()
            });

            const res = await newMessage.save();
            console.log(res);
            return {
                id: res.id,
                ...res._doc
            };
        },

        logUserIn: async (_, {loginInput: {email, password}}) => {
            // see if user exists with the email passed in
            const user = await User.findOne({ email })

            // check if entered password equals the encrypted password
            if(user && bcrypt.compareSync(password, user.password)) {

                // create a NEW token
                const token = jwt.sign({
                    user_id: newUser._id,
                    email: email.toLowerCase()
                }, process.env.TOKEN_SECRET_KEY, {
                    expiresIn: "1h"
                })

                // attach token to user model
                user.token = token

                return {
                    id: user.id,
                    ...user._doc
                }
            } else {
                // if user doesn't exist, return error
                throw new ApolloError('Incorrect password or incorrect email', 'INCORRECT_CREDENTIALS')
            }

        },
    }
}

module.exports = { resolvers }