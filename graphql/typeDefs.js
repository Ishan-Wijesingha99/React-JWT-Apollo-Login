const { gql } = require('apollo-server');

const typeDefs = gql`
    type Message {
        text: String!
        createdAt: String!
        createdBy: String!
    }

    type User {
        username: String!
        email: String!
        password: String!
        token: String!
    }

    type Query {
        message(id: ID!): Message!
        user(id: ID!): User!
    }

    input MessageInput {
        text: String!
        username: String!
    }

    input RegisterInput {
        username: String!
        email: String!
        password: String!
    }

    input LoginInput {
        email: String
        password: String
    }

    type Mutation {
        createMessage(input: MessageInput!): Message!
        registerUser(input: RegisterInput!): User
        logUserIn(input: LoginInput!): User
    }
`

module.exports = { typeDefs }