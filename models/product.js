/**Created by Ibrahim Ayman on 02/07/2017.*/

var mongoose = require("mongoose"),
    Schema = mongoose.Schema,
    mongoosastic = require("mongoosastic");

var ProductSchema = new Schema({
    category: {type: Schema.Types.ObjectId, ref: "Category"},
    name: {type: String},
    price: {type: Number},
    buyingPrice: {type: Number},
    priceAfterOffer: {type: Number},
    description: {type: String},
    quantity: {type: Number, default: 1},
    image: Array,
    Status: Array,
    colors: Array,
    videoSrc: {type: String}
});

ProductSchema.plugin(mongoosastic, {
    hosts: [
        'localhost:9200'
    ]
});

ProductSchema.plugin(require('./plugins/pagedFind'));
module.exports = mongoose.model("Product", ProductSchema);
