// import required modules/packages
const express = require("express");
const Post = require("../models/post");

// import middleware
const AuthedUser = require("../middlewares/authedUser");

// router instance
const router = express.Router();

// set local values for checking logged status
// router.use(AuthedUser, (req, res, next)=>{
//     const userId = req.user_id;
//     const user_name = req.user_name;
//     const user_email = req.user_email;
//     console.log(userId, user_name, user_email);
//     next();
// });

// app endpoints
router.get("/posts/test", (req, res)=>{
    res.status(200).send("Test route handler working");
});

router.get("/posts", async (req, res)=>{
    // retrieve all posts from the database
    const posts = await Post.find({}).populate("author", "username");
    if(!posts){
        return res.status(500).send("Something broke!, Failed to get posts");
    };
    if(posts.length === 0){
        return res.status(200).send("No posts yet");
    };
    res.status(200).json({ posts });
});

router.get("/post/:postId", AuthedUser, async (req, res)=>{
    // get requested post
    const postId = req.params.postId;

    // retrieve post by id
    const post = await Post.findById(postId).populate("author", "username");
    if(!post){
        return res.status(500).send("Something broke!, Failed to gt post by Id");
    };
    res.status(200).json({ post });
});

router.post("/new-post",AuthedUser, async (req, res)=>{
    // object destructure
    const { body } = req.body;

    // data validations
    if(!body || body.length === 0 || body ===""){
        return res.status(403).send("Post can not be empty");
    };

    // create post data
    const postData = new Post({
        author: req.user_id,
        body
    });
    // preview post data
    // console.log(postData);

    // save the post 
    await postData.save();

    res.status(201).send("New post created");
});

router.put("/edit/post/:postId",AuthedUser, async (req, res)=>{
    // get requested post
    const postId = req.params.postId;

    // find post by requested Id
    const post = await Post.findById(postId);
    if(!post){
        return res.status(500).send("Something broke!, Failed to get post by Id");
    };

    // validate post creator
    const signedUserId = req.user_id.toString();
    const postAuthorId = post.author._id.toString();

    // preview the Ids before use validation
    // console.log(signedUserId, postAuthorId);

    if(postAuthorId === signedUserId){
        // update the post
        
        // object destructuring to get the values in request body
        const { body } = req.body;
        
        // data validations
        if(!body || body.length === 0 || body === ""){
            return res.status(403).send("Post cannot be empty");
        };

        // post updates 
        const postUpdates = {
            author: req.user_id,
            body
        };

        // update the post
        await Post.findByIdAndUpdate(postId, postUpdates, { strict: true});

        res.status(201).send("Post updated");
    };
});

router.delete("/delete/post/:postId",AuthedUser, async (req, res)=>{
    // get requested post
    const postId = req.params.postId;

    // check post existence by requested Id
    const post = await Post.findById(postId);
    if(!post){
        return res.status(500).send("Something broke!, Failed to get post by Id");
    };

    // validate post creator and signed user
    const signedUserId = req.user_id.toString();
    const postAuthorId = post.author._id.toString();

    // preview the Ids before use validation
    // console.log(signedUserId, postAuthorId);

    if(postAuthorId === signedUserId){   
        // update the post
        await Post.findByIdAndDelete(postId);
        res.status(201).send("Post deleted");
    }else{
        return res.status(403).send("Not author cannot delete post");
    };
});

// export router instance
module.exports = router;