// import required modules/packages
const mongoose = require("mongoose");

// post schema instance
const postSchema = new mongoose.Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },
    body: {
        type: String,
        required: true
    },    
    date: {
        type: Date,
        default: Date.now
    },
    views: {
        type: Number,
        default: 0
    },
    comments: [{
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user"
        },
        body: {
            type: String,
            required: true
        },        
        date: {
            type: Date,
            default: Date.now
        },
        views: {
            type: Number,
            default: 0
        }
    }]
});

// post schema model instance
const Post = mongoose.model("post", postSchema);

// export model instance
module.exports = Post;