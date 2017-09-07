var router = require("express").Router(),
    Product = require("../models/product"),
    async = require("async"),
    path = require('path'),
    mime = require("mime"),
    crypto = require("crypto"),
    passportConf = require("../config/passport"),
    multer = require('multer');

var storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, './public/uploads');
    },
    filename: function (req, file, callback) {
        crypto.pseudoRandomBytes(16, function (err, raw) {
            callback(null, raw.toString('hex') + Date.now() + '.' + mime.extension(file.mimetype));
        });
    }
});

var upload = multer({storage: storage});

router.get('/add-product', passportConf.isAuthenticated, function (req, res, next) {
    res.render('admin/add-product', {errors: req.flash('errors'), pageTitle: "اضافة منتج", req: req});
});

// router.get('/update-product/:proId', passportConf.isAuthenticated, function (req, res, next) {
//     Product.find({_id: req.params.id}, function (err, product) {
//         if (err) return next(err);
//         // res.render('admin/update-product', {errors: req.flash('errors'), product: product, pageTitle: "تعديل منتج"});
//         res.redirect('/admin/update-product');
//     });
// });

router.get('/admin/ALlProducts', passportConf.isAuthenticated, function (req, res, next) {
    Product.find({}).populate("category").exec(function (err, products) {
        if (err) return next(err);
        res.render('admin/AllProducts', {errors: req.flash('errors'), products: products, pageTitle: "جميع المنتجات"});
    })
});

router.post('/add-product', upload.array('productPhotos', 8), function (req, res, next) {
    async.waterfall([
        function (callbackMethod) {
            req.checkBody('name', 'يجب ادخال اسم المنتج').notEmpty();
            req.checkBody('price', 'يجب ادخال سعر البيع').notEmpty();
            req.checkBody('buyingPrice', 'يجب ادخال سعر الشراء').notEmpty();
            req.checkBody('quantity', 'يجب ادخال الكمية').notEmpty();
            // req.checkBody('videoSrc', 'يجب ادخال رابط الفيديو').notEmpty();
            var errors = req.validationErrors();
            if (errors) {
                req.flash("error", errors);
                return res.redirect("/admin/add-product");
            }
            else {
                var newProduct = new Product({
                    name: req.body.name,
                    price: parseInt(req.body.price),
                    buyingPrice: parseInt(req.body.buyingPrice),
                    description: req.body.description,
                    quantity: req.body.quantity,
                    category: req.body.category,
                    priceAfterOffer: req.body.priceAfterOffer,
                    Status: req.body.Status.split(","),
                    videoSrc : req.body.videoSrc
                });
                newProduct.save(function (err, result) {
                    if (err) return next(err);
                    callbackMethod(err, result);
                });
            }
        }, function (callbackResult) {
            Product.findOne({_id: callbackResult._id}, function (err, product) {
                if (product) {
                    for (var i = 0; i < req.files.length; i++) {
                        product.image.push({
                            name: req.files[i].filename
                        });
                    }
                    product.save(function (err, result) {
                        if (err) return next(err);
                        req.flash("success", "تم اضافة المنتج بنجاح");
                        res.redirect('/admin/add-product');
                    });
                }
            });
        }
    ]);
});

router.delete('/api/product/remove/:id', function (req, res) {

    Product.findByIdAndRemove({_id: req.params.id}, function (err, result) {
        if (err) return res.send({type: "error", message: err});
        res.send({type: "success", message: "تم مسح المنتج بنجاح"});
    });

});

module.exports = router;
