var router = require("express").Router(),
    Bill = require("../models/Bill"),
    moment = require('moment'),
    Product = require("../models/product"),
    async = require("async"),
    passportConf = require("../config/passport");

moment.locale('ar-SA');

router.get("/BillAdd", function (req, res, next) {
    res.render("admin/BillAdd", {moment: moment, pageTitle: "عمل فاتورة"});
});

router.get("/BillsAll", function (req, res, next) {
    Bill.find({}, function (err, bills) {
        if (err) return next(err);
        res.render("admin/BillsAll", {moment: moment, bills: bills, pageTitle: "الفواتير"});
    });
});

// get Products by Angular
router.get('/api/product/getAll', passportConf.isAuthenticated, function (req, res, next) {
    Product.find({}).populate("category").exec(function (err, products) {
        if (err) return next(err);
        res.send(products);
    })
});

// get Products by Angular
router.post('/api/bill/saveBill', passportConf.isAuthenticated, function (req, res, next) {
    var newBill = new Bill();
    async.waterfall([
        function (callback) {
            newBill.clientName = req.body.clientName;
            newBill.items = req.body.items;

            newBill.orderType = req.body.orderType;
            newBill.number = req.body.number;
            newBill.address = req.body.address;

            newBill.total = parseFloat(req.body.total).toFixed(2);
            newBill.save(function (err, response) {
                if (err) return next(err);
                callback(err, response);
            })
        }, function (response, callback) {
            // use waterfall and reduce quantity
            for (var i = 0; i < newBill.items.length; i++) {
                Product.update(
                    {_id: newBill.items[i].item},
                    {
                        $inc: {quantity: -newBill.items[i].quantity}
                    },
                    function (err, updated) {
                        if (updated) {
                        }
                    });
            }
            callback(); // pass user object to final function.
        }, function () {
            res.send({type: "success", message: "تم حفظ الفاتورة بنجاح"});
        }
    ]);

});


module.exports = router;