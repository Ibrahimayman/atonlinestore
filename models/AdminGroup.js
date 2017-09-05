/**
 * Created by Ibrahim Ayman on 02/07/2017.
 */

var mongoose = require("mongoose"),
    Schema = mongoose.Schema;

var adminGroupSchema = new Schema({
    _id: {type: String},
    name: {type: String, default: ''},
    permissions: [{name: String, permit: Boolean}]
});

adminGroupSchema.plugin(require('./plugins/pagedFind'));
adminGroupSchema.index({name: 1}, {unique: true});
module.exports = mongoose.model("AdminGroup", adminGroupSchema);