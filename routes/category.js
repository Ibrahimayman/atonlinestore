var router = require("express").Router(),
    Category = require("../models/category"),
    passportConf = require("../config/passport");

router.get('/add-category', passportConf.isAuthenticated, function (req, res, next) {
    Category.find({}).populate("product").exec(function (err, CategoriesList) {
        if (err) return next(err);
        res.render('admin/add-category', {CategoriesList: CategoriesList, errors: "",pageTitle : "الاقسام الرئيسية"});
    });
});

// get Category by Id
router.get('/api/category/:id', passportConf.isAuthenticated, function (req, res, next) {
    Category.findOne({_id: req.params.id}, function (err, Category) {
        if (err) return next(err);
        res.send(Category);
    });
});

// Update Category by Id
router.put('/api/category/:id', passportConf.isAuthenticated, function (req, res) {
    Category.findOneAndUpdate({_id: req.params.id}, {$set: {"name": req.body.name.trim()}}, {returnOriginal: false}, function (err, Category) {
        if (err) return res.send({type: "error", message: err});
        res.send({type: "success", message: "تم تعديل القسم بنجاح"});
    });
});

router.post('/add-category', function (req, res, next) {

    req.checkBody('name', 'يجب ادخال اسم القسم').notEmpty();
    var errors = req.validationErrors();
    if (errors) {
        req.flash("error", errors);
        return res.redirect("/admin/add-category");
    }
    else {
        var newCategory = new Category();
        newCategory.name = req.body.name.trim();

        newCategory.save(function (err) {
            if (err) return next(err);
            return res.redirect("/admin/add-category");
        })
    }
});

router.delete('/api/category/remove/:id', function (req, res) {

    Category.findByIdAndRemove({_id: req.params.id}, function (err, result) {
        if (err) return res.send({type: "error", message: err});
        res.send({type: "success", message: "تم مسح القسم بنجاح "});
    });

});

// if u want to bind by Angular
router.get('/api/category/add-category', function (req, res, next) {
    Category.find({}).populate("product").exec(function (err, CategoriesList) {
        if (err) return next(err);
        res.send(CategoriesList);
    });
});

module.exports = router;