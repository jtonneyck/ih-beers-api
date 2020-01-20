const express = require('express');
const app = express();
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require("mongoose");
require("dotenv").config();
const createError = require('http-errors')
const cors = require("cors");
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const morgan = require('morgan');
const User = require("./models/user");
const jwt = require('./utils/jwtPromisified'); // only jwt.verify is promisified

mongoose.connect(process.env.DB, { 
        useNewUrlParser: true,  
        useCreateIndex: true,
        useUnifiedTopology: true 
    })
    .then((con)=> {
        console.log("connected to mongodb ");
    })
    .catch((error)=> {
        console.log("Not connected to mongodb, reason: \n", error);
    })

app.use(morgan('combined'));

app.use(cors({
    origin: true,
    credentials: true
}));

app.use(session({
    cookie: { secure: "auto" },
    secret: process.env.SESSION_SECRET,
    store: new MongoStore({
        mongooseConnection: mongoose.connection,
        ttl: (14 * 24 * 60 * 60), // = 14 days. Default
        autoRemove: 'native' // Default
    })
}));

function protect(req,res,next){
    if(req.session.user) next();
    else if (req.get('Authorization')){
        var AuthHeaderVal = req.get("Authorization");
        var jwtToken = AuthHeaderVal.split("Bearer: ")[1]; // header value example: 'Bearer: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1ZGEzOTQzNTU3MWQzOTY0NmY2MTQ3Y2EiLCJpYXQiOjsdfEwMDEzOTd9.u-Qh6A6YemgZGTQY7qbbqtAQ8NVTcBOQPGLfAPuiolc' 
        jwt.verify(jwtToken)
            .then((decoded)=> {
                return User.findById(decoded.userId);
            })
            .catch((err)=> {
                if(err.name === "TokenExpiredError") next(createError(401, "The access token has expired. Use the refresh token or log in in again."));
                else next(createError(401, "Invalid or missing access token."));
            })
            .then((user)=> {
                if(!user) next(createError(401));
                else {
                    delete user.password;
                    delete user.refresh_token_valid;
                    req.session.user = user;
                    next();
                }
            })
            .catch((error)=> {
                next(createError(500));
            })
    } else next(createError(401));
}

app.use("/", express.static('doc'))
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({limit: '50mb', extended: true}));
app.use(cookieParser());

app.use('/beers', require('./routes/beers'));
app.use('/auth', require('./routes/auth'));
app.use('/user', protect, require('./routes/user'));

app.use((req,res, next)=> {
    next(createError(404));
})

app.use(function (err, req, res, next) {
    if(err)res.status(err.status).json({message: err.message});
    else res.status(500).json({message: "Oeeeps, something went wrong."});
})

module.exports = app;
