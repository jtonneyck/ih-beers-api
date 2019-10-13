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
const jwt = require('jsonwebtoken');

mongoose.connect(process.env.DB, { 
        useNewUrlParser: true,  
        useCreateIndex: true,
        useUnifiedTopology: true 
    })
    .then((con)=> {
        console.log("connected to mongodb ")
    })
    .catch((error)=> {
        console.log("Not connected to mongodb, reason: \n", error)
    })

app.use(morgan('combined'))

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
    debugger
    if(req.session.user) {
        next();
    } else if (req.get('Authorization')){
        var AuthHeaderVal = req.get("Authorization")
        var jwtToken = AuthHeaderVal.split(" ")[1]

        try {
            var decoded = jwt.verify(jwtToken, process.env.JWT_SECRET);
            User.findById(decoded.userId)
                .then((user)=> {
                    debugger
                    if(!user) next(createError(403))
                    else {
                        req.session.user = user;
                        next()
                    }
                })
                .catch((error)=> {
                    next(createError(500));
                });
        } catch(err) {
            next(createError(403))
        }
    } else {
        next(createError(403))
    }
}

app.use("/test", protect, function(req,res){
    debugger
})

app.use("/", express.static('doc'))
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({limit: '50mb', extended: true}));
app.use(cookieParser());

app.use('/beers', require('./routes/beers'));
app.use('/auth', require('./routes/auth'));
app.use('/user', protect, require('./routes/user'));

app.use((req,res, next)=> {
    next(createError(404))
})

app.use(function (err, req, res, next) {
    if(err)res.status(err.status).json({message: err.message})
    else res.status(500).json({message: "Oeeeps, something went wrong."})
})

module.exports = app;
