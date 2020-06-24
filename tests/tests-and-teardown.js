var mongoose = require("mongoose");
const User = require("../models/User");
const Beer = require("../models/Beer");
const beers = require("../beers.json");
require("dotenv").config()
const newman = require('newman');

mongoose.connect(process.env.DB, { 
    useNewUrlParser: true,  
    useCreateIndex: true
})
.then((connection)=> {
   console.log("Connected to mongodb");
   return  Beer.insertMany(beers);
}) 
.then((beers)=> {
    console.log("Beers collection populated");
    return newManPromise();
})
.catch((err)=> {
    console.log("Running tests failed", err);
})
.then(()=> {
    console.log('Running tests finished. Starting teardown!');
    [User.collection.drop(), Beer.collection.drop()]
})
.then(()=> {
    console.log("User and beer collection dropped. Teardown completed.");
    mongoose.connection.close();
})
.catch((error)=> {
    console.log("User and beer collection not dropped. Teardown failed: ", error);
    mongoose.connection.close();
})

function newManPromise(){
    return new Promise(function(resolve,reject) {
        newman.run({
            collection: require('./beers-api.postman_collection.json'),
            environment: require("./Development.postman_environment.json"),
            reporters: 'cli'
        }, (err)=> {
            if (err) { reject(err); }
            resolve();
        })
    })
} 

