var cloudinary = require("../configs/cloudinary-setup").cloudinary.v2.uploader
var createError = require('http-errors');

module.exports = function(public_id,error){
    return cloudinary
    .destroy(public_id)
    .then(()=> error)
}


