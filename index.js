
// import apollo-server and mongoose packages
const { ApolloServer }  = require('apollo-server');
const mongoose = require('mongoose');

// import typeDefs and resolvers
const {typeDefs} = require('./graphql/typeDefs');
const {resolvers} = require('./graphql/resolvers');

// this is where you want you're mongoDB database to be held at
const MONGODB = "mongodb://localhost/userAuthDB";

// create apollo server with typeDefs and resolvers
const server = new ApolloServer({
    typeDefs,
    resolvers
});

// connect to mongoDB database so you can use mongoose commands
mongoose.connect(MONGODB, {useNewUrlParser: true})
.then(() => {
    // log to the console that mongoDB has been connected to mongoose
    console.log("MongoDB Connected");
    // then listen to the apollo server once that's done, this is asynchronous so we need to use .then()
    return server.listen({port: 5000});
})
.then(res => {
    // log that server is listening on URL
    console.log(`Server running at ${res.url}`)
});



// try these queries and mutations and play around with it on sandbox graphql on http://localhost:5000/



// to register a new user

// type this mutation...
// mutation RegisterUser($input: RegisterInput!) {
//   registerUser(input: $input) {
//     username
//     email
//     password
//     token
//   }
// }

// have this under 'Variables'...
// {
//     "input": {
//       "username": "IshanWij",
//       "email": "ishanwijes@gmail.com",
//       "password": "theSecretPassword"
//     }
// }

// this should create a user in the userAuthDB, check it out on mongoDB compass



// to log in as an existing user

// type this mutation...
// mutation LogUserIn($input: LoginInput!) {
//     logUserIn(input: $input) {
//       username
//       email
//       password
//       token
//     }
//  }

// have one of these under 'Variables', these are two different users we created, can test logging it with either one, we forgot the password for the other users...
// {
//     "input": {
//       "email": "john@gmail.com",
//       "password": "yeet999"
//     }
// }

// {
//     "input": {
//       "email": "notrick@gmail.com",
//       "password": "secretbox99"
//     }
// }



// to create message

// type this mutation...
// mutation CreateMessage($input: MessageInput!) {
//     createMessage(input: $input) {
//       text
//       createdAt
//       createdBy
//     }
// }

// have this under 'Variables'...
// {
//     "input": {
//       "text": "Hello there, my name is not Rick!",
//       "username": "PatrickStar"
//     }
// }



// to query a message based on id

// type this query...
// query Query($messageId: ID!) {
//     message(id: $messageId) {
//       text
//       createdAt
//       createdBy
//     }
// }

// have this under 'Variables'...
// {
//     "messageId": "633e9d38bdc9853e353201c1"
// }



// to query a user based on id

// type this query...
// query Query($userId: ID!) {
//     user(id: $userId) {
//       username
//       email
//       password
//       token
//     }
// }

// have this under 'Variables'...
// {
//     "userId": "633e97fad1f0af140b5a4eeb",
// }
