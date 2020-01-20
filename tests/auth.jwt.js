var request = require("supertest");
var app = require("../app");
var assert = require('chai').assert;
var expect = require('chai').expect;
var qs = require("querystring");
var User = require("../models/user");
var agent = request.agent(app);
var agent2 = request.agent(app);

var newUserObject = {
    username: "Piepongwong",
    firstname: "Jurgen",
    lastname: "Tonneyck",
    password: "password12345", //A password should contain minimum eight characters, at least one letter and one number
    email: "J.Tonneyck@gmail.com"
}

let signedUpUser;
describe("/auth signup a user", function() {
    before(function(done){
        request(app)
        .post('/auth/signup')
        .set({'Content-Type': "application/x-www-form-urlencoded"})
        .send(qs.stringify(newUserObject))
        .expect('Content-Type', /json/)
        .expect('set-cookie', /connect.sid/)
        .expect(200)
        .end(function(err, res){
            signedUpUser = res.body;
            console.log("LOGGED IN USER", signedUpUser)
            if(err) console.log(err);
            done(err);
        })
    })

    it("/should return the user without the password and with an id and access_token", function() {
        let signedUpUserCopy = {...newUserObject};
        let resCopy = {...signedUpUser};

        delete signedUpUserCopy.password;

        delete resCopy.id;
        delete resCopy.access_token;
        delete resCopy.refresh_token;
        delete resCopy.expires_in;
        expect(signedUpUserCopy).to.deep.equal(resCopy);

        assert(typeof signedUpUser.id === "string");
        assert(typeof signedUpUser.access_token === "string");
        assert(typeof signedUpUser.refresh_token === "string");
        assert(signedUpUser.expires_in === 900);

    })
    
})
let loggedInUser;
describe('/auth/login', () => {
    it("/should be able to login after a successful signup", function(done) {
        let loginUser = {username: newUserObject.username, password: newUserObject.password};
        // using agent to test protected routes later
        agent
            .post('/auth/login')
            .set({'Content-Type': "application/x-www-form-urlencoded"})
            .send(qs.stringify(newUserObject))
            .expect('Content-Type', /json/)
            .expect('set-cookie', /connect.sid/)
            .expect(200, function(err, res){
                if(err) console.log(err);
                loggedInUser = res.body;
                done(err);
            })        
    })

    it("/should send back user data, access token and refresh token after successful login", function() {
        let newUserObjectCopy = {...newUserObject};
        let resCopy = {...loggedInUser};
        
        delete resCopy.id;
        delete newUserObjectCopy.password;
        delete newUserObjectCopy.access_token;
        delete newUserObjectCopy.refresh_token;
        delete resCopy.expires_in;

        expect(newUserObjectCopy).to.deep.equal(resCopy);

        assert(typeof signedUpUser.id === "string");
        assert(typeof signedUpUser.access_token === "string");
        assert(typeof signedUpUser.refresh_token === "string");
        assert(signedUpUser.expires_in === 900);

    })
    
    it("/should respond with 401 with wrong credentials", function() {
        let incorrectCredentials = {
            username: "Piepongwong",
            password: "WrongPassword"
        }

        return request(app)
            .post('/auth/login')
            .send(qs.stringify(incorrectCredentials))
            .expect('Content-Type', /json/)
            .expect(401)
    })
})

describe('/user/profile', () => {
    it("/should be able to access a protected route with the access_token set in header", function(){
        return agent2
            .get("/user/profile")
            .set("Authorization", `Bearer: ${loggedInUser.access_token}`)
            .set('Cookie', [''])
            .expect(200)
            .expect(function(res){
                expect(res.body).to.deep.equal(loggedInUser);
            })
        })
});
let newAccessToken;
describe('/auth/token', () => {
    it("/should be able to exchange a refresh token for an access token", function(){
        return agent2
            .post("/auth/token")
            .set('Cookie', [''])
            .send(qs.stringify({refresh_token: signedUpUser.refresh_token}))
            .expect(205)
            .expect(function(res){
                let signedUpUser = res.body;
                let newUserObjectCopy = {...newUserObject};
                let resCopy = {...signedUpUser};
                newAccessToken = res.body.access_token;
                delete resCopy.id;
                delete newUserObjectCopy.password;
                delete newUserObjectCopy.access_token;
                delete newUserObjectCopy.refresh_token;
                expect(newUserObjectCopy).to.deep.equal(resCopy);
        
                assert(typeof signedUpUser.id === "string");
                assert(typeof signedUpUser.access_token === "string");
                assert(typeof signedUpUser.refresh_token === "string");
            })
        })
});

describe('/auth/token', () => {
    it("/should be able to access profile with newly obtained access token", function(){
        return agent2
            .post("/auth/token")
            .set('Cookie', [''])
            .send(qs.stringify({refresh_token: loggedInUser.refresh_token}))
            .expect(205)
            .expect(function(res){
                var signedUpUser = res.body;
                let newUserObjectCopy = {...newUserObject};
                let resCopy = {...signedUpUser};
                
                delete resCopy.id;
                delete newUserObjectCopy.password;
                delete newUserObjectCopy.access_token;
                delete newUserObjectCopy.refresh_token;
                expect(newUserObjectCopy).to.deep.equal(resCopy);
        
                assert(typeof signedUpUser.id === "string");
                assert(typeof signedUpUser.access_token === "string");
                assert(typeof signedUpUser.refresh_token === "string");
            })
        })
});

describe('/user/profile', () => {
    it("/should be refused access with a corrupt token", function(){
        var access_tokenCorrupted = loggedInUser.access_token;
        access_tokenCorrupted[50] = "p" // modifying at random
        access_tokenCorrupted[2] = "v" // modifying at random
        return agent2
            .set({"Authorization": ""})
            .set("Cookie", [""])
            .get("/user/profile")
            .expect(401)
        })
});

describe('/auth/logout', () => {
    it("/should log out with status code 205", function(done){
        agent2
            .get("/auth/logout")
            .set("Authorization", `Bearer: ${loggedInUser.access_token}`)
            .expect(205)
            .end(function(err, res) {
                done(err)
            })
    })

});

describe('/auth/token', () => {
    it("/should not be able to get a refresh token after logout", function(done){
        agent2
            .post("/auth/token")
            .send(qs.stringify({refresh_token: loggedInUser.refresh_token}))
            .expect(401)
            .end(function(err, res) {
                done(err)
            })
    })

});

describe('/user/profile', () => {
    it("/should be declined access with status code 401 without access_token in header", function(){
        return agent2
            set("Authorization", "")
            .get("/user/profile")
            .expect(401)
    })
});

after(function(done){ 
    // tear down
    console.log("Tear down called.")
    if(!signedUpUser.id) {
        signedUpUser = loggedInUser;
    }
    console.log(loggedInUser)
    User.findOneAndRemove(signedUpUser.id)
        .exec(function(err,res){
            if(err) throw err;
            else done(err); 
        })
})