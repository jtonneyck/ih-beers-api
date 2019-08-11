var request = require("supertest");
var app = require("../app");
var assert = require('chai').assert;
var qs = require("querystring");
var Beer = require("../models/Beer");

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
            done();
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
                done();
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
describe('POST /beers/new', function() {

    let newBeer =  {
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
            .send(qs.stringify(newBeer))
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function(err,res){
                newBeerId = res.body._id;
                done();
            })
    })

    it("responds with 400 if the same beer is tried to be created again", function(){
        request(app)
            .post(`/beers/new`)
            .send(qs.stringify(newBeer))
            .expect(400)
    })


    it("returns status code 400 on a bad request", function(){
        delete newBeer.name
        request(app)
            .post(`/beers/new`)
            .send(qs.stringify(newBeer))
            .expect(400)
    })
    
    after(function(done){
        // tearing down
        Beer.findOneAndRemove(newBeerId)
            .exec((err, res)=> {
                if(err) throw err;
                else done();
            })
    })
});

describe('GET /beers/does-not-exist', function() {
    it("returns 404 for a page that doesn't exist", function(){
        return request(app)
            .get(`/beers/${beers.body[0]._id}`)
            .expect(404)

    }) 

    it("returns 404 for a detail page of a beer that doesn't exist", function(){
        return request(app)
            .get(`/beers/does-not-exist`)
            .expect(404)
    }) 
});