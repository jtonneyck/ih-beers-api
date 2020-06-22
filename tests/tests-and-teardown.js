var mongoose = require("mongoose");
const User = require("../models/User");
require("dotenv").config();
const newman = require('newman'); // require newman in your project

newman.run({
    collection: require('./beers-api.postman_collection.json'),
    environment: require("./Development.postman_environment.json"),
    reporters: 'cli'
}, (err)=> {
    if (err) { throw err; }
    console.log('collection run complete!');

    mongoose.connect(process.env.DB, { 
        useNewUrlParser: true,  
        useCreateIndex: true
    })
    .then(()=> {
        return User.collection.drop();
    })
    .then(()=> {
        console.log("User collection dropped");
        mongoose.connection.close()
    })
    .catch((error)=> {
        console.log("User collection not dropped. Teardown unsuccesfull: ", error);
        mongoose.connection.close()
    })

})

