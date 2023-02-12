const mongoose = require("mongoose");

const Users = mongoose.Schema;

let userSchema = new Users ({
    username: {type: String},
    email: {type: String},
    password: {type: String},
    bio: {type: String},
    upvotes: {type: Array},
    downvotes: {type: Array}
}, { timestamps: true });

module.exports = mongoose.model("users", userSchema);