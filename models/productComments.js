var mongoose = require("mongoose"),
    Schema = mongoose.Schema;

var productCommentsSchema = Schema({
    user: {type: Schema.Types.ObjectId, ref: 'User'},
    product: {type: Schema.Types.ObjectId, ref: 'Product'},
    comment: {type: String},
    Email: {type: String},
    visitorName: {type: String},
    date: {type: Date, default: Date.now}
});

module.exports = mongoose.model("ProductComments", productCommentsSchema);

