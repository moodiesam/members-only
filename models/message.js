const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const MessageSchema = new Schema({
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    timestamp: { type: Date, required: true, default: Date.now },
    text: { type: String, required: true }
})

MessageSchema.virtual("url").get(function () {
    return `/messageboard/message/${this._id}`;
});

module.exports = mongoose.model("Message", MessageSchema);