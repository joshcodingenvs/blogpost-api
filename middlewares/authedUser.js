// import required modules/packages
const jwt = require("jsonwebtoken");

// function to check user validity and logged status
const authedUser = (req, res, next) =>{
    try {
        // get token from request cookies
        const token = req.cookies.token;
    
        // validate token existence
        if(!token){
            return res.status(403).send("Unauthorized");
        };
    
        // validated token
        const validToken = jwt.verify(token, process.env.SECRET);
        if(!validToken){
            return res.status(403).send("Unauthorized");
        };
    
        // assign some values to request if its a valid token
        req.user_id = validToken.user_id;
        req.user_email = validToken.user_email;
        req.user_name = validToken.user_name;
        
        next();
    } catch (err) {
        console.error(err);
        return res.status(403).send("Unauthorized");        
    }
}

// export the function 
module.exports = authedUser;