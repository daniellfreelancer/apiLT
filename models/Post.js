const mongoose = require('mongoose')

const {Schema, model} = mongoose;


const PostSchema = new Schema({
    title: String,
    summary: String,
    content: String,
    cover: String,
    author:{type: mongoose.Types.ObjectId, ref:'user'}
}, {
    timestamps: true,

});


const PostModel = model('Post', PostSchema);

module.exports = PostModel;