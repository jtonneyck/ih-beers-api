const cloudinary = require('cloudinary');
const cloudinaryStorage = require('multer-storage-cloudinary');
const multer = require('multer');
const dotenv = require("dotenv");
dotenv.config();

cloudinary.config({
  cloud_name: process.env.cloudName,
  api_key: process.env.cloudKey,
  api_secret: process.env.cloudSecret
});

var storage = cloudinaryStorage({
  cloudinary,
  folder: `beers-${process.env.ENVIRONMENT}`, // The name of the folder in cloudinary
  allowedFormats: ['jpg', 'png']
});

module.exports =  multer({ storage});
module.exports.cloudinary = cloudinary;
