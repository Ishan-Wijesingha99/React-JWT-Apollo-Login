// import relevant mongoose stuff
const { model, Schema } = require('mongoose');

// create a schema for messages
const messageSchema = new Schema({
    text: String,
    createdAt: String,
    createdBy: String
});

// from this schema, create a model and then export it
module.exports = model('Message', messageSchema);