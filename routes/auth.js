const express = require("express");
const router = express.Router();
const User = require("../models/User");
var createError = require('http-errors')

/**
 * @api {post} /auth/signup                 Sign up user
 * @apiName authentication
 * @apiGroup Auth
 * @apiParam {String} username              Mandatory username. Has to be unique.
 * @apiParam {String} firstname             Mandatory firstname of user.
 * @apiParam {String} lastname              Mandatory lastname of user.
 * @apiParam {String} email                 Mandatory email address of user. Has to be unique.
 * @apiParam {String} password              Mandatory Minimum eight characters, at least one letter and one number.
 *
 *   @apiErrorExample Error-Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "message": "user validation failed: ..."
 *     }
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
 *        "_id": "5d4d3bfc720fb89b71e013cf",
 *        "firstname": "Jurgen",
 *        "lastname": "Tonneyck",
 *        "email": "Jurgen.Tonneyck@ironhack.com",
 *     }
 */
router.post("/signup", (req,res,next)=> {   
    User.create(req.body)
        .then((user)=> {
            let {username, email, firstname, lastname, id} = user;
            let sessionData = {username, email, firstname, lastname, id};
            req.session.user = sessionData;
            res.status(200).json(sessionData);
        })
        .catch((error)=> {
            if(error.name === "ValidationError") next(createError(400, error.message))
            else next(createError(500));
        })
})
/**
 * @api {post} /auth/login                  Log in user
 * @apiName authentication
 * @apiGroup Auth
 * @apiParam {String} username              Mandatory username. The same field can also contain an email address, but still has to be called 'username'.
 * @apiParam {String} password              Mandatory.
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
 *        "_id": "5d4d3bfc720fb89b71e013cf",
 *        "firstname": "Jurgen",
 *        "lastname": "Tonneyck",
 *        "email": "Jurgen.Tonneyck@ironhack.com",
 *     }
 */

router.post("/login", (req,res,next)=> {
    User.findOne({$or: [{username: req.body.username}, {email: req.body.username}]})
        .then((user)=> {
            if(!user) next(createError(401));
            else {
            return user.comparePasswords(req.body.password)
                .then((match)=> {
                    if(match) {
                        let {username, email, firstname, lastname, id} = user;
                        let sessionData = {username, email, firstname, lastname, id};
                        req.session.user = sessionData;
                        res.status(200).json(sessionData);
                    } else {
                        next(createError(401));
                    }
                })
            }
        })
        .catch((error)=> {
            next(createError(500));
        })
})

/**
 * @api {logout} /auth/logout               Log out user
 * @apiName authentication
 * @apiGroup Auth
 * @apiParam {String} username              Mandatory username. The same field can also contain an email address, but still has to be called 'username'.
 * @apiParam {String} password   
 *   
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 500 Internal Server Error
 *     {
 *       "message": "Oeeeps, something went wrong."
 *     }
 * 
 * @apiSuccessExample Success-Response:
 *  HTTP/1.1 205 Reset Content
 */
 router.get("/logout", (req,res, next)=> {
     req.session.destroy();
     res.status(205).end();
 })

module.exports = router;
