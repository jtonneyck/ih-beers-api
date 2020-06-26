const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");
var ValidationError = mongoose.Error.ValidationError;
mongoose.set('useFindAndModify', false);
const passwordRegex = /^(?=.*[A-Za-z\$])(?=.*\d)[A-Za-z\$\d]{8,}$/;
const passwordValidationError = "A password should contain minimum eight characters, at least one letter and one number.";
var userSchema = new Schema({
    username: {
        type: String, 
        required: [true, "Please provide a username"],
        validate: {
            validator: function(username) {
              return mongoose.model('user').findOne({username: username})
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
              return mongoose.model('user').findOne({email: email})
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
        match: [passwordRegex, passwordValidationError],
        required: true
    }
})

userSchema.pre('save', function(next) {
    var user = this;
    bcrypt.hash(user.password, 10, function(err, hash) {
        if(err) throw new Error("Encryption error");
        else {
            user.password = hash;
            next();
        }
    });
});

userSchema.methods.comparePasswords = function(candidatePassword) {
    var user = this;
    return new Promise(function(resolve, reject){
        bcrypt.compare(candidatePassword, user.password, function(err, isMatch) {
            if (err) return reject(err);
            return resolve(isMatch);
        });
    })
};

module.exports = mongoose.model("user", userSchema, "users");
module.exports.passwordRegex = passwordRegex;
module.exports.passwordValidationError = passwordValidationError;
