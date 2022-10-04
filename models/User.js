
const { model, Schema } = require('mongoose');

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

module.exports = model('User', UserSchema);