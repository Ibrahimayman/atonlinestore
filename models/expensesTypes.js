/**
 * Created by Ibrahim Ayman on 02/07/2017.
 */
var mongoose = require("mongoose"),
    Schema = mongoose.Schema;

var ExpensesTypesSchema = new Schema({
    name: {type: String}
});

module.exports = mongoose.model("ExpensesTypes", ExpensesTypesSchema);