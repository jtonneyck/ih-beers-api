var request = require("supertest");
var app = require("../app");
var assert = require('chai').assert;
var expect = require('chai').expect;
var qs = require("querystring");
var User = require("../models/User");
var agent = request.agent(app);

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
        .send(qs.stringify(newUserObject))
        .expect('Content-Type', /json/)
        .expect('set-cookie', /connect.sid/)
        .expect(200)
        .end(function(err, res){
            signedUpUser = res.body;
            done();
        })
    })

    it("/should return the user without the password and with an id", function() {
        let newUserObjectCopy = {...newUserObject};
        let resCopy = {...signedUpUser};
        delete resCopy.id;
        delete newUserObjectCopy.password;
        assert(typeof signedUpUser.id === "string");
        expect(newUserObjectCopy).to.deep.equal(resCopy);
    })

    it("/should return 400 on incomplete data, no username", function(){
        let newUserObjectCopy = {...newUserObject};
        delete newUserObjectCopy.username;
        return request(app)
            .post('/auth/signup')
            .send(qs.stringify(newUserObject))
            .expect('Content-Type', /json/)
            .expect(400)
    })

    it("/should return 400 on incomplete data, no email.", function(){
        let newUserObjectCopy = {...newUserObject};
        delete newUserObjectCopy.email;
        return request(app)
            .post('/auth/signup')
            .send(qs.stringify(newUserObject))
            .expect('Content-Type', /json/)
            .expect(400)
    })

    it("/should return 400 on incomplete data, no password.", function(){
        let newUserObjectCopy = {...newUserObject};
        newUserObjectCopy.password = "";
        return request(app)
            .post('/auth/signup')
            .send(qs.stringify(newUserObject))
            .expect('Content-Type', /json/)
            .expect(400)
    })

    it("/should return 400 on incorrect data, incorrect email.", function(){
        let newUserObjectCopy = {...newUserObject};
        newUserObjectCopy.email = "adfl;kasflk;"; 
        return request(app)
        .post('/auth/signup')
        .send(qs.stringify(newUserObject))
        .expect('Content-Type', /json/)
        .expect(400)
    })

    it("/should return 400 on incorrect data, no proper password.", function(){
        // should actually by 409, but it's hard to distinguish between validation errors in mongoose
        let newUserObjectCopy = {...newUserObject};
        newUserObjectCopy.password = "2css";
        return request(app)
            .post('/auth/signup')
            .send(qs.stringify(newUserObject))
            .expect('Content-Type', /json/)
            .expect(400)
    })

    it("/should return 400 if username is already taken", function(){
        // should actually by 409, but it's hard to distinguish between validation errors in mongoose
        return request(app)
        .post('/auth/signup')
        .send(qs.stringify(newUserObject))
        .expect('Content-Type', /json/)
        .expect(400)
    })

    it("/should return 400 if email is already taken", function(){
        // should actually by 409, but it's hard to distinguish between validation errors in mongoose
        return request(app)
        .post('/auth/signup')
        .send(qs.stringify(newUserObject))
        .expect('Content-Type', /json/)
        .expect(400)
    })
    
})
describe('/auth/login', () => {
    let loggedInUser;
    it("/should be able to login after a successful signup", function(done) {
        let loginUser = {username: newUserObject.username, password: newUserObject.password};
        // using agent to test protected routes later
        agent
            .post('/auth/login')
            .send(qs.stringify(newUserObject))
            .expect('Content-Type', /json/)
            .expect('set-cookie', /connect.sid/)
            .expect(200, function(err, res){
                loggedInUser = res.body;
                done();
            })        
    })

    it("/should send back user data after successful login", function() {
        let newUserObjectCopy = {...newUserObject};
        let resCopy = {...loggedInUser};
        delete resCopy.id;
        delete newUserObjectCopy.password;
        assert(typeof loggedInUser.id === "string");
        expect(newUserObjectCopy).to.deep.equal(resCopy);
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
    it("/should be able to access a protected route after loggin in", function(){
        return agent
            .get("/user/profile")
            expect(200)
    })
});


describe('/auth/logout', () => {

    it("/should log out with status code 205", function(){
        return agent
            .get("/auth/logout")
            expect(205)
    })

});


describe('/user/profile', () => {
    it("/should be declined access with status code 403", function(){
        return agent
            .get("/user/profile")
            expect(403)
    })
});

after(function(done){
    // tear down
    if(!signedUpUser.id) {
        signedUpUser = loggedInUser;
    }
    User.findOneAndRemove(signedUpUser.id)
        .exec(function(err,res){
            if(err) throw err;
            else done(); 
        })
})