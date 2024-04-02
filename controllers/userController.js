const User = require("../models/user");
const Message = require("../models/message");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");


// Display list of all users

exports.user_list = asyncHandler(async (req, res, next) => {
    res.send("List of users not created yet");
});

// Display User create form on GET
exports.user_create_get = asyncHandler(async (req, res, next) => {
    res.render("user_form", { title: "Register New User" });
});

// Handle User create form on POST
exports.user_create_post = [
    body("firstName", "First name required")
        .trim()
        .isLength({ min: 1})
        .escape(),
    body("lastName", "Last name required")
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body("username", "Username must be at least 5 characters")
        .trim()
        .isLength({ min: 5})
        .escape(),
    body("password", "Password must be at least 3 characters")
        .trim()
        .isLength({ min: 3 })
        .escape(),

    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req);
        const hashedPassword = await bcrypt.hash(req.body.password, 10)

        const user = new User({
            title: "Register New User",
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            username: req.body.username,
            password: hashedPassword,
            membershipStatus: "regular",
        });

        if (!errors.isEmpty()) {
            res.render("user_form", {
                title: "Register New User",
                user: user,
                errors: errors.array(),
            });
        } else {
            await user.save();
            res.redirect('/messageboard');
        }
    }),
];

// Handle user log in
exports.user_login_get = asyncHandler(async (req, res, next) => {
    res.send("Not implemented yet")
})

exports.user_login_post = asyncHandler(async (req, res, next) => {
    res.send("Will log user in")
})

// Eventually handle admin delete user stuff