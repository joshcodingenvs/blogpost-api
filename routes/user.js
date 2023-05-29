// import required modules/packages
const express = require("express");
const User = require("../models/users");
const slugify = require("slugify");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// router instance
const router = express.Router();

// app endpoints
router.get("/users/test", (req, res) => {
    res.status(200).send("Test route handler working");
});

router.get("/users", async (req, res) => {
    // retrieve all users from the database
    const users = await User.find({});
    if (!users) {
        return res.status(500).send("Failed to get users, Broke something");
    };
    if (users.length === 0) {
        return res.status(200).send("No users yet");
    };

    res.status(200).json({ users });
});

router.get("/user/:username", async (req, res) => {
    // get requested username
    const username = req.params.username;

    // retrieve a user based on the requested username
    const user = await User.findOne({ username });
    if (!user) {
        return res.status(404).send("User not found");
    };
    res.status(200).json({ user });
});

router.post("/new-user", async (req, res) => {
    // perform object destructuring to get the submitted user values in respective variables
    const { username, email, firstName, lastName, password } = req.body;

    // data validations 
    if (!username || username.length === 0 || username === "") {
        return res.status(400).send("Username is required");
    };
    if (!email || email.length === 0 || email === "") {
        return res.status(400).send("Email is required");
    };
    if (!firstName || firstName.length === 0 || firstName === "") {
        return res.status(400).send("First name is required");
    };
    if (!lastName || lastName.length === 0 || lastName === "") {
        return res.status(400).send("last name is required");
    };

    // password validation
    if (!password || password === "") {
        return res.status(400).send("Password is required");
    }

    if (password.length <= 5) {
        return res.status(400).send("Password must be at least 6 characters");
    };

    // check user existence in the database before creating a new one
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.status(403).send("Account wit same email exists");
    };

    // create a full name using slugify package
    const fullName = slugify(`${firstName} ${lastName}`, { lower: true });

    // create a salt for password hashing
    const salt_rounds = 15;
    const salt = await bcrypt.genSalt(salt_rounds);
    const hash = await bcrypt.hash(password, salt);

    // create new user
    const newUser = new User({
        username,
        email,
        firstName,
        lastName,
        fullName,
        passwordHash: hash
    });

    // preview new user data
    // console.log(newUser);

    // save the user to the database
    const savedUser = await newUser.save();

    res.status(201).send("New user account created");
});

router.post("/login", async (req, res) => {
    // object destructuring to get user values submitted in request body
    const { username, email, password } = req.body;

    // data validations 
    if (username) {
        if (!username || username.length === 0 || username === "") {
            return res.status(400).send("Username is required");
        };

        // check user existence based on the submitted data
        const existingUser = await User.findOne({ username });
        if (!existingUser) {
            return res.status(403).send("Account does not exists");
        };

        // if account does exist verify the password
        const validPassword = await bcrypt.compare(password, existingUser.passwordHash);
        if (!validPassword) {
            return res.status(401).send("Incorrect username or password");
        }

        // create a token if its a valid password
        const token = jwt.sign({
            user_id: existingUser._id,
            user_name: existingUser.username
        }, process.env.SECRET);

        // check the created token
        // console.log(token);

        // send a response with cookie of the logged user
        res.cookie("token", token, {
            httpOnly: true
        }).send("Logged In");

    } else if(email){
        if (!email || email.length === 0 || email === "") {
            return res.status(400).send("Username is required");
        };

        // check user existence based on the submitted data
        const existingUser = await User.findOne({ email });
        if (!existingUser) {
            return res.status(403).send("Account does not exists");
        };

        // if account does exist verify the password
        const validPassword = await bcrypt.compare(password, existingUser.passwordHash);
        if (!validPassword) {
            return res.status(401).send("Incorrect username or password");
        }

        // create a token if its a valid password
        const token = jwt.sign({
            user_id: existingUser._id,
            user_email: existingUser.email
        }, process.env.SECRET);

        // check the created token
        // console.log(token);

        // send a response with cookie of the logged user
        res.cookie("token", token, {
            httpOnly: true
        }).send("Logged In");
    };
})

router.put("/edit/user/:userId", async (req, res)=>{
    // object destructuring to obtain the submitted user values in the request body
    const { username, email, firstName, lastName } = req.body;
        
});

router.get("/logout", (req, res)=>{
    // clear the token value to make user logged out
    res.cookie("token", "",{
        httpOnly: true,
        expires: new Date(0),
    }).send("Logged Out");
});


// export router instance
module.exports = router;