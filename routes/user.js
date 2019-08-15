const express = require("express");
const router = express.Router();

/**
 * @api {get} /user/profile                  Get profile
 * @apiName Profile
 * @apiDescription All user routes are protected. The user should be logged in first.
 * @apiGroup 
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

module.exports = router;