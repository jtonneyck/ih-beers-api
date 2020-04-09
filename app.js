var express = require('express');
var app = express();
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require("mongoose");
require("dotenv").config();
var createError = require('http-errors')
var cors = require("cors");
var session = require('express-session');
const MongoStore = require('connect-mongo')(session);
var morgan = require('morgan')

mongoose.connect(process.env.DB, { 
        useNewUrlParser: true,  
        useCreateIndex: true
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
    if(!req.session.user) {
        next(createError(403));
    } else {
        next();
    }
}

app.use("/", express.static('doc'))
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({limit: '50mb', extended: true}));
app.use(cookieParser());

app.use('/beers', require('./routes/beers/index'));
app.use('/auth', require('./routes/auth'));
app.use('/user', protect, require('./routes/user'));

app.use(function (err, req, res, next) {
    if(process.env.ENVIRONMENT !== "production") console.log(err.message, err.status);
    if(err) res.status(err.status).json({message: err.message});
    else res.status(500).json({message: "Oeeeps, something went wrong."});
})

app.use((req,res, next)=> {
    next(createError(404))
})

module.exports = app;
