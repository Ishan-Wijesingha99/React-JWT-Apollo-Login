
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