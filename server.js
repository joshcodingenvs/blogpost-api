// import required modules/packages
const express = require("express");
const http = require("http");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const logger = require("morgan");

// import routes
const userRoutes = require("./routes/user");
const postRoutes = require("./routes/post");

// dotenv configurations
dotenv.config();

// database configurations
mongoose.set("strictQuery", false);

// check available mode of environment to determine the database connectivity
if(process.env.MODE !== "production"){
    console.log(`MODE: ${process.env.MODE}`);
    mongoose.connect(process.env.MONGODB_URI_DEV).then(()=>{
        console.log("Connected to database");
    }).catch((err)=>{
        console.error("Failed to connect to Database", err);
    });
}else{
    console.log(`MODE: ${process.env.MODE}`);
    mongoose.connect(process.env.MONGODB_URI_PROD).then(()=>{
        console.log("Connected to database");
    }).catch((err)=>{
        console.error("Failed to connect to Database", err);
    });
}

// app instance
const app = express();

// app configurations
app.use(logger("dev"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

// app routes configurations
app.use("/", userRoutes);
app.use("/", postRoutes);

// server instance
const server = http.createServer(app);

server.listen(process.env.PORT, ()=>{
    console.log(`Server up and running on port: ${process.env.PORT}`);
});