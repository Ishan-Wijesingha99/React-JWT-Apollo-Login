// import relevant mongoose stuff
const { model, Schema } = require('mongoose');

// create a schema for users
const UserSchema = new Schema({
    username: {
        type: String,
        default: null
    },
    email: {
        type: String,
        unique: true
    },
    password: String,
    token: String
});

// from that schema create a model and export it
module.exports = model('User', UserSchema);