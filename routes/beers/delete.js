var express = require('express');
var router = express.Router();
var Beer = require("../../models/Beer");
var createError = require('http-errors');
var ObjectId = require('mongoose').Types.ObjectId;
var cloudinary = require('../../configs/cloudinary-setup').cloudinary;

/**
 * @api {get} /beers/delete/:id Delete a Beer
 * @apiName getAllBeers
 * @apiGroup Beers
 * @apiDescription You can only delete beers that are either created by unregistered users or have been created by yourself.
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 205 Reset Content
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
 *  @apiErrorExample Error-Response:
 *     HTTP/1.1 403 Unauthorized 
 *     {
 *       "message": ""We don't know you, guy."
 *     }
 *   @apiErrorExample Error-Response:
 *     HTTP/1.1 403 Forbidden 
 *     {
 *       "message": "This is not your beer, pal!."
 *     }
 *  @apiErrorExample Error-Response:
 *     HTTP/1.1 404 Not found
 *     {
 *       "message": "There's no such beer, buddy."
 *     }
 *  @apiErrorExample Error-Response:
 *     HTTP/1.1 400 Bad request
 *     {
 *       "message": "That's not an object id, friend."
 *     }
*/
const default_image_url = require("../../models/Beer").default_image_url;

router.get("/delete/:id", (req,res,next)=> {
    if(!ObjectId.isValid(req.params.id)) next(createError(400, "That's not an object id, friend."));
    Beer
        .findById(req.params.id)
        .then((beer)=> {
            if(!beer) return next(createError(404, "There's no such beer, buddy."));
            else if((beer && beer.owner) && !req.session.user) next(createError(403, "We don't know you, guy. Please log in first."));
            else if((beer && beer.owner) && (beer.owner.toString() !== req.session.user.id)) next(createError(403, "This is not your beer, pal!."));
            else if (beer.image_url !== default_image_url){
                return cloudinary.uploader.destroy(getPublicPictureId(beer.image_url))
                        .then((response)=> {
                            return beer.remove();
                        });
            } else if(beer.image_url === default_image_url) return beer.remove();
        })
        .then((beer)=> {
            res.status(205).json(beer);
        })
        .catch((err)=> {
            next(createError(500, "Oeeeps, something went wrong."));
        })
})

function getPublicPictureId(url) {
    return url.slice(url.lastIndexOf("/") + 1, url.lastIndexOf("."))
}
module.exports = router;