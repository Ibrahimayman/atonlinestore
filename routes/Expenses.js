var router = require("express").Router(),
    Expenses = require("../models/expenses"),
    expensestypes = require("../models/expensesTypes"),
    passportConf = require("../config/passport"),
    moment = require('moment');

moment.locale('ar-SA');

router.get('/Expenses', passportConf.isAuthenticated, function (req, res, next) {


    Expenses.find({}).populate("ExpensesTypes").exec(function (err, Expenses) {
        expensestypes.find({}, function (err, types) {
            if (err) return next(err);
            else {
                res.render('admin/Expenses', {
                    errors: req.flash('errors'),
                    types: types,
                    Expenses: Expenses,
                    moment: moment,
                    pageTitle: "المصروفات",
                    req: req
                });
            }
        });
    });
});


router.post('/Expenses', passportConf.isAuthenticated, function (req, res, nex) {
    var newExpenses = Expenses();
    newExpenses.name = req.body.name;
    newExpenses.ExpensesTypes = req.body.type;
    newExpenses.date = req.body.date;
    newExpenses.cost = req.body.cost;

    newExpenses.save(function (err) {
        if (err) return next(err);
        req.flash('success', 'تم اضافة المصروف بنجاح');
        res.redirect("/admin/Expenses");
    });

});


router.get('/api/Expenses/getTotalCost/', function (req, res, next) {
    Expenses.aggregate({
        $group: {
            _id: null,
            totalCost: {
                $sum: "$cost"
            }
        }
    }, function (err, result) {
        res.send(result);
    });
});

module.exports = router;