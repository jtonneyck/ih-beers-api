const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Beer = require("../models/Beer");
const createError = require('http-errors');
const passwordRegex = require("../models/User").passwordRegex;
const passwordValidationError = require("../models/User").passwordValidationError;
const bcrypt = require("bcrypt");
/**
 * @api {get} /user/profile                  Get profile
 * @apiName Profile
 * @apiDescription All user routes are protected. The user should be logged in first.
 * @apiGroup user
 *
 *   @apiErrorExample Error-Response:
 *     HTTP/1.1 401 Unauthorized
 *
 *   @apiErrorExample Error-Response:
 *     HTTP/1.1 500 Internal Server Error
 *     {
 *       "message": "Oeeeps, something went wrong."
 *     }
 * 
 * @apiSuccessExample Success-Response:
 *  HTTP/1.1 200 OK
 *     {
 *        "username": "MasterBrew",
 *        "id": "5d4d3bfc720fb89b71e013cf",
 *        "firstname": "Jurgen",
 *        "lastname": "Tonneyck",
 *        "email": "Jurgen.Tonneyck@ironhack.com",
 *     }
*/

router.get("/profile", (req,res, next)=> {
    res.status(200).json(req.session.user);
})

 /**
 * @api {post} /user/profile/edit           Edit firstname, lastname
 * @apiName Edit firstname, lastname
 * @apiDescription Username, email, and password are handle separately. All user routes are protected. The user should be logged in first.
 * @apiGroup user
 * @apiParam {String} firstname             Optional. firstname of user.
 * @apiParam {String} lastname              Optional. lastname of user.
 *
 *  @apiErrorExample Error-Response:
 *     HTTP/1.1 403 Forbidden
 *  @apiErrorExample Error-Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "message": "user validation failed: ..."
 *     }
 *   @apiErrorExample Error-Response:
 *     HTTP/1.1 500 Internal Server Error
 *     {
 *       "message": "Oeeeps, something went wrong."
 *     }
 * 
 * @apiSuccessExample Success-Response:
 *  HTTP/1.1 200 OK
 *     {
 *        "username": "MasterBrew",
 *        "id": "5d4d3bfc720fb89b71e013cf",
 *        "firstname": "Jurgen",
 *        "lastname": "Tonneyck",
 *        "email": "Jurgen.Tonneyck@ironhack.com",
 *     }
*/

router.post("/profile/edit", (req,res, next)=> {
    let fieldsToBeUpdated = {
        firstname: req.body.firstname, 
        lastname: req.body.firstname
    }
    User.findByIdAndUpdate(req.session.user.id, fieldsToBeUpdated, {new: true, runValidators: true}) 
    .select({username: 1, email: 1, firstname: 1, lastname: 1})
    .then(({username, email,firstname, lastname})=> {
        res.json({username, email,firstname, lastname});
    })
    .catch((error)=> {
        if(error.name === "ValidationError") next(createError(400, error.message));
        else next(createError(500));
    })
})

/**
 * @api {post} /user/profile/edit/username                  Edit username
 * @apiName Edit username
 * @apiGroup user
 * @apiDescription All user routes are protected. The user should be logged in first.
 * @apiParam {String} username              Mandatory username. Has to be unique.
 *
 *  @apiErrorExample Error-Response:
 *     HTTP/1.1 403 Forbidden
 *  @apiErrorExample Error-Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "message": "user validation failed: ..."
 *     }
 *   @apiErrorExample Error-Response:
 *     HTTP/1.1 500 Internal Server Error
 *     {
 *       "message": "Oeeeps, something went wrong."
 *     }
 * 
 * @apiSuccessExample Success-Response:
 *  HTTP/1.1 200 OK
 *     {
 *        "username": "MasterBrew",
 *        "id": "5d4d3bfc720fb89b71e013cf",
 *        "firstname": "Jurgen",
 *        "lastname": "Tonneyck",
 *        "email": "Jurgen.Tonneyck@ironhack.com",
 *     }
*/
router.post("/profile/edit/username", (req,res, next)=> {
    User.findByIdAndUpdate(req.session.user.id, {username: req.body.username}, {new: true, runValidators: true}) 
    .select({username: 1, email: 1, firstname: 1, lastname: 1})
    .then(({username, email,firstname, lastname})=> {
        res.json({username, email,firstname, lastname});
    })
    .catch((error)=> {
        if(error.name === "ValidationError") next(createError(400, error.message));
        else next(createError(500));
    })
})

/**
 * @api {post} /user/profile/edit/email                  Edit email
 * @apiName Edit email
 * @apiGroup user
 * @apiDescription All user routes are protected. The user should be logged in first.
 * @apiParam {String} username              Mandatory username. Has to be unique.
 *
 *  @apiErrorExample Error-Response:
 *     HTTP/1.1 403 Forbidden
 *  @apiErrorExample Error-Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "message": "user validation failed: ..."
 *     }
 *   @apiErrorExample Error-Response:
 *     HTTP/1.1 500 Internal Server Error
 *     {
 *       "message": "Oeeeps, something went wrong."
 *     }
 * 
 * @apiSuccessExample Success-Response:
 *  HTTP/1.1 200 OK
 *     {
 *        "username": "MasterBrew",
 *        "id": "5d4d3bfc720fb89b71e013cf",
 *        "firstname": "Jurgen",
 *        "lastname": "Tonneyck",
 *        "email": "Jurgen.Tonneyck@ironhack.com",
 *     }
*/
router.post("/profile/edit/email", (req,res, next)=> {
    User.findByIdAndUpdate(req.session.user.id, {email: req.body.email}, {new: true, runValidators: true}) 
    .select({username: 1, email: 1, firstname: 1, lastname: 1})
    .then(({username, email,firstname, lastname})=> {
        res.json({username, email,firstname, lastname});
    })
    .catch((error)=> {
        if(error.name === "ValidationError") next(createError(400, error.message));
        else next(createError(500));
    })
})
/**
 * @api {post} /user/profile/edit/password                  Edit password
 * @apiName Edit password
 * @apiDescription All user routes are protected. The user should be logged in first.
 * @apiParam {String} password              Mandatory. Minimum eight characters, at least one letter and one number.
 * @apiGroup user
 *  @apiErrorExample Error-Response:
 *     HTTP/1.1 403 Forbidden
 *  @apiErrorExample Error-Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "message": "user validation failed: ..."
 *     }
 *   @apiErrorExample Error-Response:
 *     HTTP/1.1 500 Internal Server Error
 *     {
 *       "message": "Oeeeps, something went wrong."
 *     }
 * 
 * @apiSuccessExample Success-Response:
 *  HTTP/1.1 200 OK
 *     {
 *        "username": "MasterBrew",
 *        "id": "5d4d3bfc720fb89b71e013cf",
 *        "firstname": "Jurgen",
 *        "lastname": "Tonneyck",
 *        "email": "Jurgen.Tonneyck@ironhack.com",
 *     }
*/
router.post("/profile/edit/password", (req,res, next)=> {
    debugger
    if(!passwordRegex.test(req.body.password)) return next(next(createError(400, passwordValidationError)));
    else {
        bcrypt.hash(req.body.password, 10, function(err, hash) {
            if(err) next(createError(500, "Encryption Error"));
            else {
                User.findByIdAndUpdate(req.session.user.id,{password: hash}, {new: true})
                .select({username: 1, email: 1, firstname: 1, lastname: 1})
                .then(({username, email,firstname, lastname})=> {
                    res.json({username, email,firstname, lastname});
                })
                .catch((error)=> {
                    if(error.name === "ValidationError") next(createError(400, error.message));
                    else next(createError(500));
                })
            }
        })
    }   
})
/**
 * @api {get} /user/my-beers                  Get my beers
 * @apiName My beers
 * @apiDescription All user routes are protected. The user should be logged in first.
 * @apiGroup user
 *
 *   @apiErrorExample Error-Response:
 *     HTTP/1.1 403 Forbidden
 *
 *   @apiErrorExample Error-Response:
 *     HTTP/1.1 500 Internal Server Error
 *     {
 *       "message": "Oeeeps, something went wrong."
 *     }
 * 
 * @apiSuccessExample Success-Response:
 *  HTTP/1.1 200 OK
 *     [{
 *        "image_url": "https://images.punkapi.com/v2/2.png",
 *        "_id": "5d4d3bfc720fb89b71e013cf",
 *        "name": "Trashy Blonde",
 *        "tagline": "You Know You Shouldn't",
 *        "first_brewed": "04/2008",
 *        "description": "A titillating, neurotic, peroxide punk of a Pale Ale. Combining attitude, style, substance, and a little bit of low self esteem for good measure; what would your mother say? The seductive lure of the sassy passion fruit hop proves too much to resist. All that is even before we get onto the fact that there are no additives, preservatives, pasteurization or strings attached. All wrapped up with the customary BrewDog bite and imaginative twist.",
 *        "attenuation_level": 76,
 *        "owner": "5d4d3bfc720fb89b71e013cf"
 *     }, {
 *      ...
 *     }]
 */

router.get("/my-beers", (req,res,next)=> {
    Beer.find({owner: req.session.user.id})
        .then((beers)=> {
            res.json(beers);
        })
        .catch((err)=> {
            next(createError(500, "Oeeeps, something went wrong."));
        })
})

module.exports = router;