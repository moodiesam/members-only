const User = require("../models/user");
const Message = require("../models/message");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

// Passport functions for authentication, sessions and serialization

passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        const user = await User.findOne({ username: username });
        if (!user) {
          return done(null, false, { message: "Incorrect username" });
        };
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            // passwords do not match!
            return done(null, false, { message: "Incorrect password" })
        };
        return done(null, user);
      } catch(err) {
        return done(err);
      };
    })
  );
  
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch(err) {
      done(err);
    };
  });

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
    res.render("user_login", { title: "Log In" })
})

exports.user_login_post = (req, res, next) => {
    const user = {
        username: req.body.username,
        password: req.body.password
    };

    console.log("too far");
    res.redirect('/messageboard');
}

// Log Out page

exports.user_logout_get = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        res.redirect("/")
    })
}

// Eventually handle admin delete user stuff

