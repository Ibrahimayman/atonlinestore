/**
 * Created by Ibrahim Ayman on 01/07/2017.
 */
var mongoose = require("mongoose");

mongoose.promise = global.promise;
mongoose.connect("mongodb://ibrahimayman:Abcd#123321@ds157469.mlab.com:57469/ecommercedofrome", function (err) {
    if (err) {
        console.log(err);
    }
    else {
        console.log("Connected to DB");
    }
});
// mongoose contains connection all time
module.exports = mongoose;
