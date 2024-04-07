const express = require("express");
const router = express.Router();

// Passport functions for authentication, sessions and serialization

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');
const bcrypt = require('bcryptjs');


passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        const user = await User.findOne({ username: username });
        if (!user) {
            console.log("no user")
          return done(null, false, { message: "Incorrect username" });
        };
        if (user.password !== password) {
          return done(null, false, { message: "Incorrect password" });
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

// Controller Modules

const message_controller = require("../controllers/messageController");
const user_controller = require("../controllers/userController");

// GET messageboard homepage

router.get("/", message_controller.index);

// GET and POST to create messages

router.get("/message/create", message_controller.message_create_get);
router.post("/message/create", message_controller.message_create_post);

// GET and POST to create users

router.get("/user/create", user_controller.user_create_get);
router.post("/user/create", user_controller.user_create_post);

// GET and POST to login users

router.get("/user/login", user_controller.user_login_get);
router.post("/user/login", passport.authenticate('local', {successRedirect: '/', failureRedirect: '/messageboard/user/login'}));

// GET and POST to logout user

router.get("/user/logout", user_controller.user_logout_get);

// GET list of all users

router.get("/users", user_controller.user_list);

module.exports = router