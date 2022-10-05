// import gql statement
const { gql } = require('apollo-server');

// typeDefs for graphql
const typeDefs = gql`
    # types
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

    # queries
    type Query {
        message(id: ID!): Message!
        user(id: ID!): User!
    }

    # inputs
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

    # mutations
    type Mutation {
        createMessage(input: MessageInput!): Message!
        registerUser(input: RegisterInput!): User
        logUserIn(input: LoginInput!): User
    }
`

// export typeDefs
module.exports = { typeDefs }