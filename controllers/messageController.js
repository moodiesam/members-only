const Message = require("../models/message");
const User = require("../models/user");
const asyncHandler = require("express-async-handler");

// Homepage will show all messages
exports.index = asyncHandler(async (req, res, next) => {
    // Should display all messages in reverse timestamp date
    const currentUser = req.user;
    const allMessages = await Message.find({})
        // .sort({ timestamp: 1 })
        .populate("author")
        .exec();

    res.render("messageboard_list", { title: "Messageboard", messageboard_list: allMessages, currentUser: currentUser })
})

// Display Message create form on GET
exports.message_create_get = asyncHandler(async (req, res, next) => {
    res.send("Display Message create form not made yet")
});

// Handle Message create form on POST
exports.message_create_post = asyncHandler(async (req, res, next) => {
    res.send("Handle message create not implemented yet")
});

// ******* Create message delete options for admin eventually *******