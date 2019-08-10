var express = require('express');
var router = express.Router();
var Beer = require("../models/Beer")
var createError = require('http-errors')

/**
 * @api {get} /beers Get all Beers
 * @apiName getAllBeers
 * @apiGroup Beers
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     [{
 *        "image_url": "https://images.punkapi.com/v2/2.png",
 *        "_id": "5d4d3bfc720fb89b71e013cf",
 *        "name": "Trashy Blonde",
 *        "tagline": "You Know You Shouldn't",
 *        "first_brewed": "04/2008",
 *        "description": "A titillating, neurotic, peroxide punk of a Pale Ale. Combining attitude, style, substance, and a little bit of low self esteem for good measure; what would your mother say? The seductive lure of the sassy passion fruit hop proves too much to resist. All that is even before we get onto the fact that there are no additives, preservatives, pasteurization or strings attached. All wrapped up with the customary BrewDog bite and imaginative twist.",
 *        "attenuation_level": 76,
 *     }, {
 *      ...
 *     }]
 *
 *   @apiErrorExample Error-Response:
 *     HTTP/1.1 500 Internal Server Error
 *     {
 *       "message": "Oeeeps, something went wrong."
 *     }
*/

router.get('/', function(req, res, next) {
  Beer.find({})
    .then((beers)=> {
      res.status(200).json(beers)
    })
    .catch((error)=> {
      next(createError(500))
    })
});

/**
 * @api {get} /beers/random Get a Random Beer
 * @apiName getRandomBeer
 * @apiGroup Beers
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *        "image_url": "https://images.punkapi.com/v2/2.png",
 *        "_id": "5d4d3bfc720fb89b71e013cf",
 *        "name": "Trashy Blonde",
 *        "tagline": "You Know You Shouldn't",
 *        "first_brewed": "04/2008",
 *        "description": "A titillating, neurotic, peroxide punk of a Pale Ale. Combining attitude, style, substance, and a little bit of low self esteem for good measure; what would your mother say? The seductive lure of the sassy passion fruit hop proves too much to resist. All that is even before we get onto the fact that there are no additives, preservatives, pasteurization or strings attached. All wrapped up with the customary BrewDog bite and imaginative twist.",
 *        "attenuation_level": 76,
 *     }
 *
 *   @apiErrorExample Error-Response:
 *     HTTP/1.1 500 Internal Server Error
 *     {
 *       "message": "Oeeeps, something went wrong."
 *     }
*/

router.get("/random", (req,res,next)=> {
  Beer.countDocuments()
    .then((count)=> {
      var random = Math.floor(Math.random() * count)
      return Beer.findOne().skip(random)
    })
    .then((beer)=> {
      res.status(200).json(beer)
    })
    .catch((error)=> {
      next(createError(500))
    })
})

/**
 * @api {get} /beers/search?q=beer Get searched Beers
 * @apiName searchBeer
 * @apiGroup Beers
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     [{
 *        "image_url": "https://images.punkapi.com/v2/2.png",
 *        "_id": "5d4d3bfc720fb89b71e013cf",
 *        "name": "Trashy Blonde",
 *        "tagline": "You Know You Shouldn't",
 *        "first_brewed": "04/2008",
 *        "description": "A titillating, neurotic, peroxide punk of a Pale Ale. Combining attitude, style, substance, and a little bit of low self esteem for good measure; what would your mother say? The seductive lure of the sassy passion fruit hop proves too much to resist. All that is even before we get onto the fact that there are no additives, preservatives, pasteurization or strings attached. All wrapped up with the customary BrewDog bite and imaginative twist.",
 *        "attenuation_level": 76,
 *     },
 *      {
 *        "image_url": ...
 *       }
 *     ]
 *
 *   @apiErrorExample Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "message": "Not Found."
 *     }
 *
 *   @apiErrorExample Error-Response:
 *     HTTP/1.1 500 Internal Server Error
 *     {
 *       "message": "Oeeeps, something went wrong."
 *     }
*/

router.get("/search", (req,res, next)=> {
  Beer.find({$text: {$search: req.query.q}})
    .then((beers)=> {
      if(!beers) next(createError(404));
      else res.status(200).json(beers);
    })
    .catch((error)=> {
      next(createError(500));
    })
})

/**
  * @api {get} /beers/:id Get a Single Beer
  * @apiName getOneBeer
  * @apiGroup Beers
  * @apiParam {String} id unique Beer ID.
  * @apiSuccessExample Success-Response:
  *     HTTP/1.1 200 OK
  *     {
  *        "image_url": "https://images.punkapi.com/v2/2.png",
  *        "_id": "5d4d3bfc720fb89b71e013cf",
  *        "name": "Trashy Blonde",
  *        "tagline": "You Know You Shouldn't",
  *        "first_brewed": "04/2008",
  *        "description": "A titillating, neurotic, peroxide punk of a Pale Ale. Combining attitude, style, substance, and a little bit of low self esteem for good measure; what would your mother say? The seductive lure of the sassy passion fruit hop proves too much to resist. All that is even before we get onto the fact that there are no additives, preservatives, pasteurization or strings attached. All wrapped up with the customary BrewDog bite and imaginative twist.",
  *        "attenuation_level": 76,
  *     }
  *
  *   @apiErrorExample Error-Response:
  *     HTTP/1.1 404 Not Found
  *     {
  *       "message": "Not Found."
  *     }
  *
  *   @apiErrorExample Error-Response:
  *     HTTP/1.1 500 Internal Server Error
  *     {
  *       "message": "Oeeeps, something went wrong."
  *     }
*/

router.get("/:beerId", (req,res, next)=> {
  debugger
  Beer.findById(req.params.beerId)
    .then((beer)=> {
      if(!beer) next(createError(404));
      else res.status(200).json(beer);
    })
    .catch((error)=> {
      next(createError(500))
    })
})

/**
 * @api {Post} /beers/new Post a new Beer
 * @apiName createBeer
 * @apiGroup Beers
 * @apiParam {String} tagline               Mandatory tagline of the Beer.
 * @apiParam {String} description           Mandatory description of the Beer.
 * @apiParam {Date/String} first_brewed     Mandatory date of first brew of Beer. String in Date format.
 * @apiParam {Number} attenuation_level     Mandatory level of attenuation.
 * @apiParam {String} brewers_tips          Mandatory tips of the brewer.
 * @apiParam {String} contributed_by        Mandatory name of the brewer.
 * @apiParam {String} name                  Mandatory name of Beer. It has to be unique.
 *
 *   @apiErrorExample Error-Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "message": "beer validation failed: ..."
 *     }
 *
 *   @apiErrorExample Error-Response:
 *     HTTP/1.1 500 Internal Server Error
 *     {
 *       "message": "Oeeeps, something went wrong."
 *     }
*/

router.post("/new", (req,res, next)=> {
  Beer.create(req.body)
    .then((beer)=> {
      res.status(200).json(beer)
    })
    .catch((error)=> {
      next(createError(400, error.message))
    })
  })


module.exports = router;
