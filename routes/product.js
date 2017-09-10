var router = require("express").Router(),
    Product = require("../models/product"),
    async = require("async"),
    path = require('path'),
    mime = require("mime"),
    crypto = require("crypto"),
    passportConf = require("../config/passport"),
    del = require('delete'),
    fs = require('fs'),
    multer = require('multer');
var ObjectId = require('mongodb').ObjectID;

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

// get update product page..
router.get('/admin/update-product/:id', passportConf.isAuthenticated, function (req, res, next) {
    Product.findById({_id: req.params.id}, function (err, product) {
        if (err) return next(err);
        // res.send(product);
        res.render('admin/update-product', {errors: req.flash('errors'), product: product, pageTitle: "تعديل منتج"});
    });
});

// post for update...
router.post('/admin/update-product/:id', passportConf.isAuthenticated, function (req, res, next) {
    Product.findById(req.body.product_id, function (err, result) {
        if (err) res.status(500).send(err);
        else {
            result.name = req.body.name || result.name;
            result.price = req.body.price || result.price;
            result.buyingPrice = req.body.buyingPrice || result.buyingPrice;
            result.quantity = req.body.quantity || result.quantity;
            result.size = req.body.size || result.size;

            result.videoSrc = req.body.videoSrc || result.videoSrc;
            result.description = req.body.description || result.description;

            result.homePage = req.body.homePage || result.homePage;

            result.save((err, todo) => {
                if (err) {
                    res.status(500).send(err)
                }
                res.redirect("/admin/ALlProducts");
            });
        }
    })
});


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
                    videoSrc: req.body.videoSrc,
                    size: req.body.size
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

// for client side.
router.delete('/api/product/remove/:id', function (req, res) {

    Product.findByIdAndRemove({_id: req.params.id}, function (err, result) {
        var files = result.image;
        deleteFiles(files, function (err) {
            if (err) {
                console.log(err);
            } else {
                if (err) return res.send({type: "error", message: err});
                res.send({type: "success", message: "تم مسح المنتج بنجاح"});
            }
        });
    });
});

// for sever side
router.post('/admin/ALlProducts', function (req, res) {
    Product.findByIdAndRemove({_id: req.body.proDelId}, function (err, result) {
        var files = result.image;
        for (var x = 0; x < files.length; x++) {
            fs.unlink("./public/uploads/" + files[x].name, function (err) {
                if (err) return;
            });
        }
        res.redirect("/admin/ALlProducts");
    });
});

module.exports = router;
