/**
 * Created by Ibrahim Ayman on 02/07/2017.
 */

var router = require("express").Router();
var User = require("../models/user");
var Cart = require("../models/cart");
var Product = require("../models/product");
var category = require("../models/category");
var moment = require('moment');

moment.locale('ar-SA');

router.get("/users", function (req, res, next) {
    User.find({}, function (err, users) {
        if (err) return next(err);
        res.render("admin/users", {users: users, moment: moment, pageTitle: "المستخدمين"});
    });
});


router.get("/index", function (req, res, next) {
    User.count({}, function (err, countUsers) {
        Product.count({}, function (err, countProduct) {
            category.count({}, function (err, countCategory) {
                if (err) return next(err);
                res.render("admin/index", {
                    pageTitle: "الصفحة الرئيسية",
                    countUsers: countUsers,
                    countProduct: countProduct,
                    countCategory: countCategory
                })
            });
        });
    });
});

router.delete('/admin/api/user/remove/:id', function (req, res, next) {
    var workflow = req.app.utility.workflow(req, res);
    workflow.on('RemoveCart', function () {
        Cart.findOneAndRemove({owner: req.params.id}, function (err, result) {
            if (err) return next(err);
            workflow.emit('RemoveUser');
        });
    });
    workflow.on("RemoveUser", function () {
        User.findByIdAndRemove({_id: req.params.id}, function (err, result) {
            if (err) return next(err);
            res.send({type: "success", message: "تم مسح المستخدم بنجاح"});
        });
    });

    workflow.emit("RemoveCart");

});

module.exports = router;