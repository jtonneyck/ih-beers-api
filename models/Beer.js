const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var beerSchema = new Schema({
    tagline: {type: String, required: true},
    description: {type: String, required: true},
    first_brewed: {type: String, required: true},
    brewers_tips: {type: String, required: true},
    attenuation_level: {type: Number, required: true},
    contributed_by: {type: String, required: true},
    name: {type: String, required: true}
})

beerSchema.index({
    name: 'text', 
    tagline: 'text',
    brewers_tips: 'text',
    description: 'text'
});


module.exports = mongoose.model("beer", beerSchema, "beers");