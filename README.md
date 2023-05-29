# Blogpost-API powered by express.js framework.
Hi there, I'm so glad you are here. Leave a comment in respective ["Youtube"] tutorial video or leave a Tweet at my ["Twitter"] account, If you have found some bugs or anything not working expectedly.

["Youtube"]: https://youtube.com/@joshcodingenv
["Twitter"]: https://youtube.com/joshcodingenv

In this project you are going to build a full working blogpost-api backend, some of must have packages are such;

### Packages / modules / Third-parties
* express.js 
* bcrypt
* body-parser
* cookie-parser
* dotenv
* express
* jsonwebtoken
* mongoose
* morgan
* nodemon
* slugify

### Software Packages
* MongoDB 
* MongoDBCompass
* Insomnia / PostMan
* Vscode IDE / any IDE of your choice

To get started with the project you can clone the repo or simply download the code,

After download, run the command as follows

### npm install
Install all the projects dependencies as specified in the package.json file.

### npm start
Starts the server with automatic reload enabled using nodemon package

Take some time and move around to check the endpoints, basically their are two endpoints by groups
* user endpoints - the login and authentications process
* posts endpoints - crud operations on posts

The available endpoints respectively are
### users

* /users/test - test route handler for user routes
* /users - retrieves all users from the database
* /user/:username -retrieves a single user based on requested username
* /new-user - creates a new user in the database
* /login - creates a token for logged user and stores it in cookie
* /edit/user/:userId - edits a single user based on the Id requested
* /delete/user/:userId - removes a single user based on the Id requested
* /logout - clears the token and making a user logged out


### posts

* /posts/test - test route handler for posts routes
* /posts - retrieves all posts from the database
* /post/:postId - retrieves a single post based on Id
* /new-post - creates new posts in the app
* /edit/post/:postId - edit a specific post based on the requested Id and author of post
* /delete/post/:postId - removes a post from the database permanently

Thats all in a short summary, Hope you've enjoyed and you'll be back for yet another project.