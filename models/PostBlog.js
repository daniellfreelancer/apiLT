const mongoose = require('mongoose')


const postBlogSchema = new mongoose.Schema({
    title: {type: String},
    summary: {type: String},
    content: {type: String},
    cover: {type: String},
    author: {type: mongoose.Types.ObjectId, ref:'admin'},
    category:{type: String}

},{
    timestamps: true
})

const POSTBLOG = mongoose.model(
    'postblog',
    postBlogSchema
)

module.exports = POSTBLOG

