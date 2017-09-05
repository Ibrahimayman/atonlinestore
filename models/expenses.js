/**
 * Created by Ibrahim Ayman on 02/07/2017.
 */

var mongoose = require("mongoose"),
    Schema = mongoose.Schema;

var ExpensesSchema = new Schema({
    name: {type: String},
    ExpensesTypes: {type: Schema.Types.ObjectId, ref: 'ExpensesTypes'},
    Date: {type: Date, default: Date.now},
    cost: {type: Number}
});

module.exports = mongoose.model("Expenses", ExpensesSchema);