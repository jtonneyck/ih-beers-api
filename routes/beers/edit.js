var express = require('express');
var router = express.Router();
var Beer = require("../../models/Beer");
var createError = require('http-errors');
var uploader = require('../../configs/cloudinary-setup');
var cloudinary = require("../../configs/cloudinary-setup").cloudinary.v2.uploader;
const cloudinaryImgUploadRollback = require('../../middleware/cloudinaryImgUploadRollback');
const { create } = require('../../models/Beer');

/**
 * @api {post} /beers/edit/:beerId Edit a Beer
 * @apiName editBeer
 * @apiGroup Beers
 * @apiParam {String} tagline               Optional tagline of the Beer.
 * @apiParam {String} description           Optional description of the Beer.
 * @apiParam {Date/String} first_brewed     Optional date of first brew of Beer. String in Date format: YYYY or YYYY-MM or YYYY-MM-DD.
 * @apiParam {Number} attenuation_level     Optional level of attenuation.
 * @apiParam {String} brewers_tips          Optional tips of the brewer.
 * @apiParam {String} contributed_by        Optional name of the brewer.
 * @apiParam {String} name                  Optional name of Beer. It has to be unique.
 * @apiParam {File} picture                 Optional. Picture has to be a png or jpg. If provided, set mimetype to multipart/form-data. The old picture will be removed if a new one is chosen.
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
*     HTTP/1.1 200 Ok
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

router.post("/edit/:beerId",uploader.single("picture"), (req,res, next)=> {
    if(req.body.owner) delete req.body.owner; // you can't change the owner
    Beer.findById(req.params.beerId)
        .then(async (beer)=> {
            if(!beer) return next(createError(404, "This beer does not exist"));
            if(beer.name === req.body.name) delete req.body.name // If the name is the same, ignore it because of the validator.
            return Beer.findByIdAndUpdate(req.params.beerId, req.body, {new: true, runValidators: true});
        })
        .then(async (beer)=> {
            // if the user changed the picture, remove the old one
            if(req.file && req.file.secure_url !== beer.image_url) await cloudinaryImgUploadRollback(getPublicPictureId(req.file.secure_url));
            res.status(200).json(beer);
        })
        .catch(async (error)=> {            
            if(req.file) await cloudinaryImgUploadRollback(req.file.public_id);
            next(createError(400, error.message));
        })
})

module.exports = router;

function getPublicPictureId(url) {
    return url.slice(url.lastIndexOf("/") + 1, url.lastIndexOf("."));
}