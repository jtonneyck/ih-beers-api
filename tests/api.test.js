var request = require("supertest");
var app = require("../app");
var assert = require('chai').assert;
var qs = require("querystring");
var Beer = require("../models/Beer");
const mongoose = require("mongoose");
var cloudinary = require("../configs/cloudinary-setup").cloudinary;
var beers;
describe('GET /beers/', function() {
    it("responds with json", function(done){
        request(app)
        .get('/beers')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function(err, res){
            beers = res;
            done(err);
        })
    }) 
});

describe('GET /beers/random', function() {
    it("responds with json", function(done){
        request(app)
            .get('/beers/random')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function(err, res){
                done(err);
            })
    }) 
});

describe('GET /beers/:id', function() {
    it("responds with json", function(){
        request(app)
            .get(`/beers/${beers.body[0]._id}`)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
    }) 
});

describe('GET /beers?query=beer', function() {
    it("responds with json with a correct search term", function(){
        request(app)
            .get(`/beers?query=beer`)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
    })

    it("reponse has 0 elements with an impossible search term", function(){
        request(app)
            .get(`/beers?query=beel;kasf;klasdfl;ka;sldkfi9213sdcaasdf;'mvzx'pfdr`)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
    })
});

let newBeerId;
let newBeerWithImage;
describe('POST /beers/new', function() {

    let newBeerA =  {
        "name": "Trojan Horse",
        "tagline": "Lovely little beer",
        "description": "This beer is tender on the tongue, but ruthless to your vestibular system.",
        "first_brewed": "2019",
        "brewers_tips": "Don't chuck it.",
        "attenuation_level": "20",
        "contributed_by": "Jurgen" 
    }
    
    it("responds with 200 json after a beer has been created", function(done){
        request(app)
            .post(`/beers/new`)
            .send(qs.stringify(newBeerA))
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function(err,res){
                newBeerId = res.body._id;
                done(err);
            })
    })

    let newBeerB =  {
        name: "Lovely Beer",
        tagline: "Lovely little beer",
        description: "This beer is tender on the tongue.",
        first_brewed: "2019",
        brewers_tips: "Don't chuck it.",
        attenuation_level: "20",
        contributed_by: "Jurgen" 
    }

    it("responds with 200 json after a beer has been created with an image", function(done){
        request(app)
            .post(`/beers/new`)
            .field("name", newBeerB.name)
            .field("tagline", newBeerB.tagline)
            .field("description", newBeerB.description)
            .field("first_brewed", newBeerB.first_brewed)
            .field("brewers_tips", newBeerB.brewers_tips)
            .field("attenuation_level", newBeerB.attenuation_level)
            .field("contributed_by", newBeerB.contributed_by)
            .attach("picture", "tests/beer2.jpeg")
            .expect(200)
            .end(function(err,res){
                newBeerWithImage = res.body
                done(err);
            })
    })

    it("/should respond with beer data", function(done) {
        request(app)
        .get(`/beers/${newBeerId}`)
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function(err,res){
            newBeer = res.body;
            done(err);
        })
    })
    it("responds with 400 if the same beer is tried to be created again", function(done){
        request(app)
            .post(`/beers/new`)
            .send(qs.stringify(newBeerA))
            .expect(400)
    })

    it("returns status code 400 on a bad request", function(){
        delete newBeerA.name
        request(app)
            .post(`/beers/new`)
            .send(qs.stringify(newBeer))
            .expect(400)
    })
});

describe("GET /beers/delete/:id", function(){
    it("returns 400 for a beer that doesn't exist", function(){
        return request(app)
        .get(`/beers/deelte/asdfojasdfkln321`)
        .expect(404)
    })
})

describe('GET /beers/does-not-exist', function() {
    it("returns 404 for a page that doesn't exist", function(){
        return request(app)
            .get(`/beers/${beers.body[0].id}`)
            .expect(404)

    }) 

    it("returns 404 for a detail page of a beer that doesn't exist", function(){
        return request(app)
            .get(`/beers/does-not-exist`)
            .expect(404)
    }) 

});

after(function(){
    var ObjectId = mongoose.Types.ObjectId;
    let reverseUploadProm = cloudinary.uploader.destroy(getPublicPictureId(newBeerWithImage.image_url));
    let teardownBeersProm = Beer.deleteMany({
        _id: {
            $in: [newBeer._id, newBeerWithImage._id]
        }})

    return Promise.all([reverseUploadProm, teardownBeersProm])
             .catch(err=> {
                 console.log(err)
             })
             .then(()=> {
                 console.log("Beers Tear down successful. Beers removed from db. Picture destroyed on cloudinary.")
             })
})

function getPublicPictureId(url) {
    return url.slice(url.lastIndexOf("/") + 1, url.lastIndexOf("."))
}