const mongoose = require("mongoose");

const Comments = mongoose.Schema;

let commentSchema = new Comments ({
    comment: {type: String},
    creator: {type: String},
    post: {type: mongoose.SchemaTypes.ObjectId}
}, { timestamps: true });

module.exports = mongoose.model("comments", commentSchema);