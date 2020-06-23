var express = require('express');
var router = express.Router();
var Beer = require("../../models/Beer")
var createError = require('http-errors')
var uploader = require('../../configs/cloudinary-setup')
var cloudinaryImgUploadRollback = require("../../middleware/cloudinaryImgUploadRollback");

/**
 * @api {post} /beers/new Post a new beer
 * @apiName createBeer
 * @apiGroup Beers
 * @apiParam {String} tagline               Mandatory tagline of the Beer.
 * @apiParam {String} description           Mandatory description of the Beer.
 * @apiParam {Date/String} first_brewed     Mandatory date of first brew of Beer. String in Date format: YYYY or YYYY-MM or YYYY-MM-DD.
 * @apiParam {Number} attenuation_level     Mandatory level of attenuation.
 * @apiParam {String} brewers_tips          Mandatory tips of the brewer.
 * @apiParam {String} contributed_by        Mandatory name of the brewer.
 * @apiParam {String} name                  Mandatory name of Beer. It has to be unique.
 * @apiParam {File} picture                 Optional. Picture has to be a png or jpg. If provided, set mimetype to multipart/form-data. If not provided, the default picture will be "https://images.punkapi.com/v2/2.png".
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
 * 
 *  @apiSuccessExample Success-Response:
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
*/

router.post("/new", uploader.single("picture"), (req,res, next)=> {
    if(req.session.user) req.body.owner = req.session.user.id;
    if(req.file) req.body.image_url = req.file.secure_url;
    Beer.create(req.body)
        .then((beer)=> res.status(200).json(beer))
        .catch(async (error)=> {            
          if(req.file) await cloudinaryImgUploadRollback(req.file.public_id);
          next(createError(400, error.message));
      })
})

module.exports = router;

