var mongoose = require("mongoose"),
    Schema = mongoose.Schema;

var BillSchema = new Schema({
    clientName: {type: String},
    items: [{
        item: {
            type: Schema.Types.ObjectId,
            ref: 'Product'
        },
        quantity: {type: Number, default: 1},
        price: {type: Number, default: 0}
    }],
    total: {type: Number, default: 0},
    Date: {type: Date, default: Date.now},
    paid: {type: Number},
    orderType : {type: String},
    number : {type: String},
    address : {type: String}
});

module.exports = mongoose.model("Bill", BillSchema);
