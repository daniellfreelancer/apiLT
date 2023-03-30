const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username: {type: String, required: true},
    email: {type: String},
    password:[{type: String, required: true}],
    from: [{type: String, required: true}],
    role: {type: String, required: true},
    logged: {type: String, required: true},

})

const UsersBlog = mongoose.model(
    'user',
    userSchema
)

module.exports = UsersBlog