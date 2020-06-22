var express = require('express');
var router = express.Router();
var Beer = require("../../models/Beer")
var createError = require('http-errors')

/**
 * @api {get} /beers Get all beers
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
 *        "contributed_by": "Jurgen"
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

module.exports = router;
