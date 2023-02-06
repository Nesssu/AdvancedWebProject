const mongoose = require("mongoose");

const Posts = mongoose.Schema;

let postSchema = new Posts ({
    code: {type: String},
    creator: {type: mongoose.SchemaTypes.ObjectId},
    votes: {type: Number},
    comments: {type: Array},
    voters: {type: Array}
}, { timestamps: true });

module.exports = mongoose.model("posts", postSchema);