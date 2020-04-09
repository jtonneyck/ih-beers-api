var mongoose = require("mongoose");
const User = require("../models/User");
require("dotenv").config();

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

