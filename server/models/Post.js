const mongoose = require("mongoose");

const Posts = mongoose.Schema;

let postSchema = new Posts ({
    code: {type: String},
    creator: {type: mongoose.SchemaTypes.ObjectId},
    votes: {type: Number},
}, { timestamps: true });

module.exports = mongoose.model("posts", postSchema);