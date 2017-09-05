/**
 * Created by Ibrahim Ayman on 02/07/2017.
 */

var mongoose = require("mongoose"),
    Schema = mongoose.Schema;

var SubscribersSchema = new Schema({
    email: {type: String, unique: true, lowercase: true}
});

module.exports = mongoose.model("Subscribers", SubscribersSchema);