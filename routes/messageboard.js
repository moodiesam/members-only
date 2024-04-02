const express = require("express");
const router = express.Router();

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
router.post("/user/login", user_controller.user_login_post);

// GET list of all users

router.get("/users", user_controller.user_list);

module.exports = router