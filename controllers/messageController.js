const message = require("../models/message");
const Message = require("../models/message");
const User = require("../models/user");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator")

// Homepage will show all messages
exports.index = asyncHandler(async (req, res, next) => {
    // Should display all messages in reverse timestamp date
    const currentUser = req.user;
    const allMessages = await Message.find({})
        .sort({ timestamp: -1 })
        .populate("author")
        .exec();

    res.render("messageboard_list", { title: "Messageboard", messageboard_list: allMessages, currentUser: currentUser })
})

// Display Message create form on GET
exports.message_create_get = asyncHandler(async (req, res, next) => {
    const currentUser = req.user;
    console.log(currentUser);
    if (currentUser) {
        res.render("message_form", { title: "Write New Message", currentUser: currentUser })
    } else {
        res.redirect("/messageboard/user/login")
    }
});

// Handle Message create form on POST
exports.message_create_post = [
    body("title", "Message Needs a title")
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body("message", "Please include a message to post")
        .trim()
        .isLength({ min: 1 })
        .escape(),

    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req);
        const currentUser = req.user;

        const newMessage = new Message({
            author: currentUser._id,
            title: req.body.title,
            text: req.body.message,
        });

        if (!errors.isEmpty()) {
            res.render("message_form", {
                title: "Write new message",
                message: newMessage,
                currentUser: currentUser,
                errors: errors.array(),
            });
        } else {
            await newMessage.save();
            res.redirect('/')
        }
    })
]

// GET and POST for message delete options for admin 

exports.message_delete_get = asyncHandler(async (req, res, next) => {
    const message = await Message.findById(req.params.id).exec();

    if (message === null) {
        res.redirect("/");
    }

    res.render("message_delete", {
        title: "Delete Message",
        message: message,
    })
})

exports.message_delete_post = asyncHandler(async (req, res, next) => {
    await Message.findByIdAndDelete(req.body.messageid)
    res.redirect("/")
})