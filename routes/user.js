// import required modules/packages
const express = require("express");
const User = require("../models/users");
const slugify = require("slugify");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// import middleware's
const AuthedUser = require("../middlewares/authedUser");

// router instance
const router = express.Router();

// app endpoints
router.get("/users/test", (req, res) => {
    res.status(200).send("Test route handler working");
});

router.get("/users", AuthedUser, async (req, res) => {
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

router.get("/user/:username", AuthedUser, async (req, res) => {
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

    } else if (email) {
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

router.put("/edit/user/:userId", AuthedUser, async (req, res) => {
    // object destructuring to obtain the submitted user values in the request body
    const { username, email, firstName, lastName } = req.body;

    // get user requested id
    const userId = req.params.userId;

    // check user existence based on requested Id
    const existingUser = await User.findById(userId);
    if (!existingUser) {
        return res.status(403).send("Unauthorized");
    }

    // obtain a plain existing user id
    const existingUserId = existingUser._id.toString();

    // check user data based on means of signup, this commented code is about validations
    // const signedUserByUsername = {
    //     _id: req.user_id,
    //     name: req.user_name
    // };

    // const signedUserByEmail = {
    //     _id: req.user_id,
    //     email: req.user_email
    // };

    // check the logged In user Id
    // console.log(signedUserByUsername._id.toString(), signedUserByEmail._id.toString());

    // make some edits based on data submitted and user validity
    if (userId === existingUserId) {
        // print true if the id is the same, an earlier validation line
        //console.log(true);

        // re-create some data
        fullName = slugify(`${firstName} ${lastName}`, { lower: true });

        const userUpdates = {
            username, email, firstName, lastName, fullName
        };

        // check the data before updating the user
        // console.log(userUpdates);

        // update the user
        const userUpdated = await User.findByIdAndUpdate(userId, userUpdates, { strict: true });
        res.status(201).send("User updated");
    } else {
        return res.status(403).send("Forbidden");
    };
});

router.delete("/delete/user/:userId", AuthedUser, async (req, res) => {
    // get the requested user id
    const userId = req.params.userId;

    // check if the singed user is the user requesting the deletion
    const signedUserId = req.user_id;
    if (userId === signedUserId) {

        // check user existence before deletion
        const existingUser = await User.findById(userId);
        if (existingUser) {
            // delete the user if exists
            await User.findByIdAndDelete(userId);

            res.status(200).send("User deleted");
        } else {
            return res.status(403).send("Forbidden");
        };
    }else{
        return res.status(403).send("Forbidden");
    }
})

router.get("/logout", (req, res) => {
    // clear the token value to make user logged out
    res.cookie("token", "", {
        httpOnly: true,
        expires: new Date(0),
    }).send("Logged Out");
});

// export router instance
module.exports = router;