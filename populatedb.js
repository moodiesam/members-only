#! /usr/bin/env node

console.log(
    'This script populates some test items and calagories to our database. Specified database as argument - e.g.: node populatedb "mongodb+srv://cooluser:coolpassword@cluster0.lz91hw2.mongodb.net/inventory_app?retryWrites=true&w=majority"'
);
  
// Get arguments passed on command line
const userArgs = process.argv.slice(2);

const User = require("./models/user");
const Message = require("./models/message");

const users = [];
const messages = [];

const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

const mongoDB = userArgs[0];

main().catch((err) => console.log(err));

async function main() {
    console.log("Debug: About to connect");
    await mongoose.connect(mongoDB);
    console.log("Debug: Should be connected?");
    await createUsers();
    await createMessages();
    console.log("Debug: Closing mongoose");
    mongoose.connection.close();
};

async function userCreate(index, firstName, lastName, username, password, membershipStatus) {
    const userdetail = {
        firstName: firstName,
        lastName: lastName,
        username: username,
        password: password,
        membershipStatus: membershipStatus
    }

    const user = new User(userdetail);
    await user.save();
    users[index] = user;
    console.log(`Added user: ${lastName}, ${firstName}`);
};

async function messageCreate(index, author, title, timestamp, text) {
    const messagedetail = {
        author: author,
        title: title,
        text: text
    };
    if (timestamp != false) messagedetail.timestamp = timestamp;

    const message = new Message(messagedetail);
    await message.save();
    messages[index] = message;
    console.log(`Added message: ${title}`);
};

async function createUsers() {
    console.log("adding Users");
    await Promise.all([
        userCreate(0,
            "User",
            "One",
            "username1",
            "userpassword1",
            "admin"
            ),
        userCreate(1,
            "User",
            "Two",
            "username2",
            "userpasswork2",
            "regular")
    ]);
};

async function createMessages() {
    console.log("Adding Messages");
    await Promise.all([
        messageCreate(0,
            users[0],
            "First Title",
            false,
            "I am the admin and this is the first message"
            ),
        messageCreate(1,
            users[1],
            "Second Title",
            false,
            "I am a regular user and this is the second message"
            )
    ])
}