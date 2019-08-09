var express = require('express');
var router = express.Router();
var Beer = require("../models/Beer")
var createError = require('http-errors')

router.get('/', function(req, res, next) {
  Beer.find({})
    .then((beers)=> {
      res.json({beers})
    })
    .catch((error)=> {
      next(createError(500))
    })
});

router.get("/random", (req,res,next)=> {
  debugger
  Beer.count()
    .then((count)=> {
      var random = Math.floor(Math.random() * count)
      debugger
      return Beer.findOne().skip(random)
    })
    .then((beer)=> {
      debugger
      res.json(beer)
    })
    .catch((error)=> {
      debugger
      next(createError(500))
    })
})

router.get("/:beerId", (req,res, next)=> {
  Beer.findById(req.params.beerId)
    .then((beer)=> {
      res.json({beer})
    })
    .catch((error)=> {
      next(createError(500))
    })
})

router.post("/new", (req,res, next)=> {
  debugger
  Beer.create(req.body)
    .then((beer)=> {
      res.json(beer)
    })
    .catch((error)=> {
      next(createError(500))
    })
  })

module.exports = router;
