var express = require('express');
var app = express();
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require("mongoose");
require("dotenv").config();
var createError = require('http-errors')
var cors = require("cors");
const session = require('express-session')

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
}))

mongoose.connect(process.env.DB, { useNewUrlParser: true } )
    .then((con)=> {
        console.log("connected")
    })
    .catch((error)=> {
        console.log("Not connected, reason: \n", error)
    })

function protect(req,res,next){
    if(!req.session.user) {
        next(createError(403));
    } else {
        next();
    }
}

app.use(cors());
app.use("/", express.static('doc'))
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({limit: '50mb'}));
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
