const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    username: { type: String, required: true },
    password: { type: String, required: true },
    membershipStatus: { 
        type: String,
        required: true,
        enum: ["regular", "admin"],
        default: "regular"    
    }
});

UserSchema.virtual("url").get(function () {
    return `/messageboard/user/${this._id}`;
});

UserSchema.virtual("fullName").get(function () {
    return `${this.firstName} ${this.lastName}`;
});

module.exports = mongoose.model("User", UserSchema);