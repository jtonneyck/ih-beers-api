const Beer = require("../models/Beer");
var createError = require('http-errors');

function beerFormDataValidator(req,res,next) {
      let newBeer = new Beer(req.body);
      newBeer.validate()
      .then((validate)=> {
        next();
      })
      .catch((error)=> {
        next(createError(400, error.message));
      })
  }

module.exports = beerFormDataValidator;
