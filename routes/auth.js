const express = require("express");
const router = express.Router();
const User = require("../models/user");
const createError = require('http-errors')
const jwt = require('jsonwebtoken');

/**
 * @api {post} /auth/signup                 Sign up user
 * @apiName Signup
 * @apiGroup Auth
 * @apiDescription After signing up the user is: 
 * A) automatically logged in by setting a cookie and maintaining a session server side. You have to enable cross-site access!
 * If you use axios, you can enable it by setting withCredentials to true. 
 * Otherwise the cookie will not be set and the session will not be maintained on the server. Also bear in mind, that your development front-end server should run on https. 
 * With CRA you should start your server with 'HTTPS=true npm start'. Otherwise the cookie will not be set.
 * B) not automatically logged in, but the user will receive a JWT. If the JWT is put in the header like "Authorization: Basic theJWT", the user will be perceived as being logged in as well.
 * With JWT bases authentication CORS is no longer an issue.
 * 
 * This API is build to work with a SPA. Therefore there's no server side redirect. 
 * 
 * The sign up data has to be send in the x-www-form-urlencoded data. You might want to use qs (https://www.npmjs.com/package/qs)in combination with axios for this. 
 * @apiParam {String} username              Mandatory username. Has to be unique.
 * @apiParam {String} firstname             Mandatory firstname of user.
 * @apiParam {String} lastname              Mandatory lastname of user.
 * @apiParam {String} email                 Mandatory email address of user. Has to be unique.
 * @apiParam {String} password              Mandatory. Minimum eight characters, at least one letter and one number.
 * @apiHeaderExample {String} Header-Example:
 *     
 *  "Content-Type: application/x-www-form-urlencoded"
 *     
 *  @apiErrorExample Error-Response:
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
 *  set-cookie: connect.sid=s%3A0VMqqYBK3LGMKoKeeP8ntme0ZqT2rW95.2LmE%2BkYoa9khWbw7yBPJLHzxrF6b%2FDQhsraFNF%2FIvc8; Path=/; HttpOnly
 *     {
 *        "username": "MasterBrew",
 *        "id": "5d4d3bfc720fb89b71e013cf",
 *        "firstname": "Jurgen",
 *        "lastname": "Tonneyck",
 *        "email": "Jurgen.Tonneyck@ironhack.com",
 *        "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c", 
 *        "refresh_token": "eyJhbGciOiJIUzI1asdfdssInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFasdfI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c",  
 *        "expires_in": 900   
 *     }
 */

router.post("/signup", (req,res,next)=> {   
    debugger
    User.create(req.body)
        .then((user)=> {
            let {username, email, firstname, lastname, id} = user;
            let sessionData = {username, email, firstname, lastname, id};
            req.session.user = sessionData;
            res.status(200).json({
                ...sessionData, 
                access_token: jwt.sign({userId: user._id}, process.env.JWT_SECRET, {expiresIn: 60 * 15}), 
                refresh_token: jwt.sign({userId: user._id}, process.env.JWT_SECRET_REFRESH),
                expires_in: 900
            });
        })
        .catch((error)=> {
            debugger
            if(error.name === "ValidationError") next(createError(400, error.message))
            else next(createError(500));
        })
})
/**
 * @api {post} /auth/login                  Log in user
 * @apiName Login
 * @apiDescription After logging in:
 * A) a cookie is set and a session is maintained on the server. You have to enable cross-site access! If you use axios, you can enable it by setting withCredentials to true. 
 * Otherwise the cookie will not be set and the session will not be maintained on the server. Also bear in mind that you development front-end server should run on https. 
 * With CRA you should start your server with 'HTTPS=true npm start'. Otherwise the cookie will not be set.
 * B) not automatically logged in, but the user will receive a JWT. If the JWT is put in the header like "Authorization: Basic theJWT", the user will be perceived as being logged in as well.
 * With JWT bases authentication CORS is no longer an issue.
 * 
 * This API is build to work with a SPA. Therefore there's no server side redirect. 
 * 
 * The sign up data has to be send in the x-www-form-urlencoded data. You might want to use qs (https://www.npmjs.com/package/qs)in combination with axios for this. 
 * @apiGroup Auth
 * @apiParam {String} username              Mandatory username. The same field can also contain an email address, but still has to be called 'username'.
 * @apiParam {String} password              Mandatory.
 * @apiHeaderExample {String} Header-Example:
 *     
 *  "Content-Type: application/x-www-form-urlencoded"
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
 *  set-cookie: connect.sid=s%3A0VMqqYBK3LGMKoKeeP8ntme0ZqT2rW95.2LmE%2BkYoa9khWbw7yBPJLHzxrF6b%2FDQhsraFNF%2FIvc8; Path=/; HttpOnly
 *     {
 *        "username": "MasterBrew",
 *        "id": "5d4d3bfc720fb89b71e013cf",
 *        "firstname": "Jurgen",
 *        "lastname": "Tonneyck",
 *        "email": "Jurgen.Tonneyck@ironhack.com",
 *        "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c",  
 *        "refresh_token": "eyJhbGciOiJIUzI1asdfdssInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFasdfI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c",  
 *        "expires_in": 900   
 *     }
 */

router.post("/login", (req,res,next)=> {
    User.findOne({$or: [{username: req.body.username}, {email: req.body.username}]})
        .then((user)=> {
            if(!user) next(createError(401), "Invalid credentials.");
            else {
            return user.comparePasswords(req.body.password)
                .then((match)=> {
                    if(match) {
                        user.update({refresh_token_valid: true}, {new: true})
                            .then((dbResponse)=> {
                                let {username, email, firstname, lastname, id} = user;
                                let sessionData = {username, email, firstname, lastname, id};
                                req.session.user = sessionData;
                                res.status(200).json({
                                    ...sessionData, 
                                    access_token: jwt.sign({userId: user._id}, process.env.JWT_SECRET, {expiresIn: 60 * 15}), 
                                    refresh_token: jwt.sign({userId: user._id}, process.env.JWT_SECRET_REFRESH),
                                    expires_in: 900
                                })
                            })
                            .catch((err)=> {
                                next(createError(500));
                            })
                    } else {
                        next(createError(401, "Invalid credentials."));
                    }
                })
            }
        })
        .catch((error)=> {
            next(createError(500));
        })
})

/**
 * @api {get} /auth/logout               Log out user
 * @apiName Logout
 * @apiGroup Auth
 * @apiDescription After logging out, the session is destroyed and the refresh token invalidated.
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
    User.findByIdAndUpdate(req.session.user.id, {refresh_token_valid: false})
        .then((user)=> {
            req.session.destroy();
            res.status(205).end();
        })
        .catch((error)=> {
            next(createError(500))
        })

})
/**
 * @api {post} /auth/token            
 * @apiName Refresh token
 * @apiDescription The access token will expire in 15 minutes. To obtain a new one, you need to use the refresh token. If you are logged out, the refesh token will be invalidated. In that case you need to login again to obtain a new access token and a valid refresh token.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 500 Internal Server Error
 *     {
 *       "message": "Oeeeps, something went wrong."
 *     }
 * 
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 401 Unauthorized
 *     {
 *       "message": "Token invalidated."
 *     }
 * 
 * @apiSuccessExample Success-Response:
 *  HTTP/1.1 205 Reset Content
 *     {
 *        "username": "MasterBrew",
 *        "id": "5d4d3bfc720fb89b71e013cf",
 *        "firstname": "Jurgen",
 *        "lastname": "Tonneyck",
 *        "email": "Jurgen.Tonneyck@ironhack.com",
 *        "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c", 
 *        "refresh_token": "eyJhbGciOiJIUzI1asdfdssInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFasdfI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c",  
 *        "expires_in": 900   
 *     }
 */
router.post("/token", (req,res, next)=> {
    jwt.verify(req.body.refresh_token, process.env.JWT_SECRET_REFRESH, (err, decoded)=> {
        debugger
        if(err) next(createError(500));
        else if(!decoded) next(createError(401));
        else {
            User.findById(decoded.userId)
                .then((user)=> {
                    if(!user.refresh_token_valid) next(createError(401, "Token invalidated"))
                    else {
                        let {username, email, firstname, lastname, id} = user;
                        let userData = {username, email, firstname, lastname, id};
                        res.status(205).json({
                            ...userData, 
                            access_token: jwt.sign({userId: user._id}, process.env.JWT_SECRET), 
                            refresh_token: jwt.sign({userId: user._id}, process.env.JWT_SECRET_REFRESH)
                        });
                    }
                })
                .catch((err)=> {
                    next(createError(500));
                })
        }
    })
})

module.exports = router;
