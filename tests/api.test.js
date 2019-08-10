var request = require("supertest");
var app = require("../app");
var assert = require('chai').assert;
var qs = require("querystring");
var Beer = require("../models/Beer");

var response;
before(function(done) {
    // to get _id to work with later
    request(app)
        .get('/beers')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function(err, res){
            response = res;
            done();
        })
});

describe('GET /beers/', function() {
    it("responds with json", function(done){
        request(app)
            .get('/beers')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function(err, res){
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
    
    it("responds with json", function(done){
        request(app)
            .get(`/beers/${response.body[0]._id}`)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function(err, res){
                done();
            })
    }) 
});

describe('GET /beers?query=beer', function() {
    it("responds with json with a correct search term", function(done){
        request(app)
            .get(`/beers?query=beer`)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function(err, res){
                response = res;
                done();
            })
    })

    it("reponse has 0 elements with an impossible search term", function(done){
        request(app)
            .get(`/beers?query=beel;kasf;klasdfl;ka;sldkfi9213sdcaasdf;'mvzx'pfdr`)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function(err, res){
                assert(res.body.length, 0)
                done();
            })
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

    describe("",function(){
        it("responds with 400 if the same beer is tried to be created again", function(){
            return request(app)
            .post(`/beers/new`)
            .send(qs.stringify(newBeer))
            .expect(400)
        })
    })

    it("returns status code 400 on a bad request", function(done){
        delete newBeer.name
        request(app)
            .post(`/beers/new`)
            .send(qs.stringify(newBeer))
            .expect(400)
            .end(function(err, res){
                if(err) console.log(err);
                newBeerId = res.body._id
                done();
            })
    })
    debugger
    after(function(done){
        // tearing down
        Beer.findOneAndRemove(newBeerId)
            .exec((err, res)=> {
                if(err) throw err
                else done()
            })
    })
});

describe('GET /beers/does-not-exist', function() {
    it("returns 404 for a page that doesn't exist", function(){
        return request(app)
            .get(`/beers/${response.body[0]._id}`)
            .expect(404)
    }) 

    it("returns 404 for a detail page of a beer that doesn't exist", function(){
        return request(app)
            .get(`/beers/doesnotexist`)
            .expect(404)
    }) 
});