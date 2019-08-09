var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require("mongoose");
require("dotenv").config();
var createError = require('http-errors')

mongoose.connect(process.env.DB)
    .then((con)=> {
        console.log("connected")
    })
    .catch((error)=> {
        console.log("Not connected, reason: \n", error)
    })
var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/beers', require('./routes/beers'));

app.use((req,res, next)=> {
    next(createError(404))
})
app.use(function (err, req, res, next) {
    if(err)res.status(err.status).send(err.message)
    else res.status(500).send("Oeeeps, something went wrong.")
  })

module.exports = app;
