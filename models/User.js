const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");
var ValidationError = mongoose.Error.ValidationError;

const userSchema = new Schema({
    username: {
        type: String, 
        required: [true, "Please provide a username"],
        validate: {
            validator: function(username) {
              return this.model("user").findOne({name: username})
                        .then((user)=> {
                            if(user) throw new Error("An user with this name already exists.");
                            else return;
                        })
            },
            message: "An user with this name already exists."
        }
    },
    email: {
        type: String,
        required: [true, "Please provide an email address."],
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill in a valid email address.'],
        validate: {
            validator: function(email) {
              return this.model("user").findOne({email: email})
                        .then((user)=> {
                            if(user) throw new Error("Annnn user with this email address already exists.");
                            else return;
                        })
            },
            message: "An user with this email address already exists."
        }
    },
    firstname: {type: String, required: true},
    lastname: {type: String, required: true},
    password: {
        type: String,
        match: [/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/, "A password should contain minimum eight characters, at least one letter and one number"],
        required: true
    }
})

userSchema.pre('save', function(next) {
    bcrypt.hash(this.password, 10, function(err, hash) {
        if(err) throw new Error("Encryption error");
        else {
            this.password = hash;
            next();
        }
        });
});

userSchema.methods.comparePasswords = function(candidatePassword) {
    return new Promise(function(resolve, reject){
        bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
            if (err) return reject(err);
            return resolve(isMatch);
        });
    })
};

module.exports = mongoose.model("user", userSchema, "users");

