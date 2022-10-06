// import dotenv so that you can store your secret key on your device and you're device only (server)
require('dotenv').config()

// import bcrypt and jwt
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

// import mongoose models
const User = require('../models/User')
const Message = require('../models/Message')

// import ApolloError from apollo-server-errors, this gives a specific type of error that we will use
const { ApolloError } = require('apollo-server-errors')

// create resolvers
const resolvers = {
    Query: {
        // get a single user by id
        user: (_, args) => User.findById(args.id).clone().catch(err => console.log(err)),
        // get a single message by id
        message: (_, args) => Message.findById(args.id).clone().catch(err => console.log(err))
    },

    Mutation: {
        // register user mutation
        registerUser: async (_, {input: {username, email, password} }) => {
            // see if old user exists already with the same email
            const oldUser = await User.findOne({ email })
            
            // throw error if that user exists
            if(oldUser) throw new ApolloError(`A user is already registered with the email ${email}`, 'USER_ALREADY_EXISTS')
        
            // if oldUser doesn't exist it will get to this part, now encrypt password
            const encryptedPassword = await bcrypt.hash(password, 10)

            // create a newUser based off the information the user gave us and the encryptedPassword
            const newUser = new User({
                username: username,
                email: email.toLowerCase(),
                password: encryptedPassword
            })

            // create a JWT for the new user, because now that he's registered, it isn't enough to just add him to the database, we actually need to sign him in so he can access our app, and create a JWT that gives him access for one hour 
            const token = jwt.sign({
                // the user_id that will be saved in the JWT itself will be the same id as the one mongoose/mongoDB generates for the user
                user_id: newUser._id,
                // email in lowercase will also be saved on the jwt itself
                email: email.toLowerCase()
            }, process.env.TOKEN_SECRET_KEY, {
                expiresIn: "1h"
            })

            // attach that token to this specific user on the mongoose model
            newUser.token = token

            // save user to MongoDB database
            const res = await newUser.save()

            // we should return something so that when you execute this mutation on graphql sandbox on the browser, this will be returned
            return {
                id: res.id,
                ...res._doc
            }
        },

        // create message mutation
        createMessage: async (_, {input: {text, username} }) => {
            // create new message using mongoose
            const newMessage = new Message({
                text: text,
                createdBy: username,
                createdAt: new Date().toISOString()
            });

            // save that message to MongoDB database
            const res = await newMessage.save();

            // log that final message document to the console
            console.log(res);

            // we should return something so that when you execute this mutation on graphql sandbox on the browser, this will be returned
            return {
                id: res.id,
                ...res._doc
            };
        },

        // log user in mutation
        logUserIn: async (_, {input: {email, password}}) => {
            // see if user exists with the email passed in
            const user = await User.findOne({ email })

            // check if user exists and entered password equals the encrypted password
            if(user && bcrypt.compareSync(password, user.password)) {
                
                // as the information the user has provided matches with what's found in the database and the password they've typed is the same as the encrypted password found in the database, we can now log them in and create a new jwt for their session, valid for one hour
                const token = jwt.sign({
                    // the user_id that will be saved in the JWT itself will be the same id as the one mongoose/mongoDB generates for the user
                    user_id: user._id,
                    // email in lowercase will also be saved on the jwt itself
                    email: email.toLowerCase()
                }, process.env.TOKEN_SECRET_KEY, {
                    expiresIn: "1h"
                })

                // attach that token to this specific user on the mongoose model
                user.token = token

                // we should return something so that when you execute this mutation on graphql sandbox on the browser, this will be returned
                return {
                    id: user.id,
                    ...user._doc
                }
            } else {
                // if user doesn't exist in the database or the password that was provided does not match the encryptedPassword, return an error
                throw new ApolloError('Incorrect password or incorrect email', 'INCORRECT_CREDENTIALS')
            }

        },
    }
}

// export resolvers
module.exports = { resolvers }