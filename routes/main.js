/**
 * Created by Ibrahim Ayman on 01/07/2017.
 */
var router = require("express").Router();
var User = require("../models/user");
var Product = require("../models/product");
var Cart = require("../models/cart");
var async = require("async");
var _ = require("lodash");
var stripe = require("stripe")('sk_test_90yMCyP0kAVCmeJSs22PDx2m');


function Paginate(req, res, next) {
    var perPage = 16;
    var page = req.params.page;
    if (page === undefined)
        page = 0;
    else
        page = page - 1;
    Product
        .find({category: req.params.id})
        .skip(perPage * page)
        .limit(perPage)
        .populate("category")
        .exec(function (err, products) {
            if (err) return next(err);
            Product.count({category: req.params.id}).exec(function (err, count) {
                if (err) return next(err);
                else {
                    var pages = Math.round(count / perPage);
                    res.render("main/category", {
                        products: products,
                        pages: pages + 1,
                        categoryId: req.params.id
                    })
                }
            });
        });
}

Product.createMapping(function (err, mapping) {
    if (err) {
        console.log("error creating mapping");
        console.log(err);
    } else {
        console.log("Mapping created");
        console.log(mapping);
    }
});

var stream = Product.synchronize();
var count = 0;

stream.on('data', function () {
    count++;
});

stream.on('close', function () {
    console.log("Indexed " + count + " documents");
});

// router.get("/", function (req, res, next) {
//     //if (req.user) {
//     Paginate(req, res, next);
//     // }
//     // else {
//     //     res.render("main/home");
//     // }
// });

router.get("/", function (req, res, next) {
    /* get newArrivals */
    Product.find({homePage: "newArrival"}).limit(4).exec(function (err, result) {
        if (err) return next(err);
        res.render("main/product-main", {newArrivals: result})
    });
});

router.get("/products/:id/:page", function (req, res, next) {
    Paginate(req, res, next);
});

// get user products from his cart.
router.get('/cart', function (req, res, next) {
    Cart
        .findOne({owner: req.user._id})
        .populate('items.item')
        .exec(function (err, foundCart) {
            if (err) return next(err);
            res.render('main/cart', {
                foundCart: foundCart,
                message: req.flash('remove')
            });
        });
});

// add product to user cart.
router.post('/product/:product_id', function (req, res, next) {
    Cart.findOne({owner: req.user._id}, function (err, cart) {

        cart.items.push({
            item: req.body.product_id,
            price: parseFloat(req.body.priceValue),
            quantity: parseInt(req.body.quantity)
        });

        cart.total = (cart.total + parseFloat(req.body.priceValue)).toFixed(2);

        cart.save(function (err) {
            if (err) return next(err);
            return res.redirect('/cart');
        });

    });
});

// Remove Product from Cart
router.post("/remove", function (req, res, next) {
    Cart.findOne({owner: req.user._id}, function (err, foundCart) {
        foundCart.items.pull(String(req.body.item));
        foundCart.total = (foundCart.total - parseFloat(req.body.price)).toFixed(2);
        foundCart.save(function (err, found) {
            if (err) return next(err);
            req.flash('success', 'item removed successfully');
            res.redirect("/cart");
        });
    });
});

// Remove Product from Cart by Angular
router.delete("/api/cart/remove/:item/:price", function (req, res, next) {
    Cart.findOne({owner: req.user._id}, function (err, foundCart) {
        foundCart.items.pull(String(req.params.item));
        foundCart.total = (foundCart.total - parseFloat(req.params.price)).toFixed(2);
        foundCart.save(function (err, found) {
            if (err) return next(err);
            res.send({type: "success", message: "تم مسح المنتج من العربة بنجاح"});
        });
    });
});

// payment routes
router.post('/payment', function (req, res, next) {

    var stripeToken = req.body.stripeToken;
    var currentCharges = Math.round(req.body.stripeMoney * 100);
    stripe.customers.create({
        source: stripeToken,
    }).then(function (customer) {
        return stripe.charges.create({
            amount: currentCharges,
            currency: 'usd',
            customer: customer.id
        });
    }).then(function (charge) {
        async.waterfall([
            function (callback) {
                Cart.findOne({owner: req.user._id}, function (err, cart) {
                    callback(err, cart);
                });
            },
            function (cart, callback) {
                User.findOne({_id: req.user._id}, function (err, user) {
                    if (user) {
                        for (var i = 0; i < cart.items.length; i++) {
                            user.history.push({
                                item: cart.items[i].item,
                                paid: cart.items[i].price
                            });
                        }

                        user.save(function (err, user) {
                            if (err) return next(err);
                            callback(err, user); // pass user object to final function.
                        });
                    }
                });
            },
            function (user) {
                Cart.update({owner: user._id}, {$set: {items: [], total: 0}}, function (err, updated) {
                    if (updated) {
                        res.redirect('/profile');
                    }
                });
            }
        ]);
    });
});

router.post('/search', function (req, res, next) {
    res.redirect('/search?q=' + req.body.q);
});

router.get('/search', function (req, res, next) {
    if (req.query.q) {
        Product.search({
            query_string: {query: req.query.q}
        }, function (err, results) {
            results:
                if (err) return next(err);
            var data = results.hits.hits.map(function (hit) {
                return hit;
            });
            res.render('main/search-result', {
                query: req.query.q,
                data: data
            });
        });
    }
});

router.get("/", function (req, res) {
    res.render("main/home", {
        title: "home page"
    });
});

router.get("/about", function (req, res) {
    res.render("main/about", {
        title: "about"
    });
});

router.get("/users", function (req, res) { // for test users.
    User.find({}, function (err, users) {
        res.json(users);
    });
});

/*  Get ALL Products By Category Id  */
router.get("/products/:id", function (req, res, next) {
    // Product
    //     .find({category: req.params.id})
    //     .populate("category")
    //     .exec(function (err, products) {
    //         if (err) return next(err);
    //         res.render("main/category", {products: products})
    //     });
    Paginate(req, res, next);
});

/*  Get Product By Id  */
router.get("/product/:id", function (req, res, next) {
    Product.findById({_id: req.params.id}).populate("category").exec(function (err, product) {
        if (err) return next(err);
        else {
            Product
                .find({category: product.category._id})
                .populate("category").limit(4)
                .exec(function (err, SimilarProducts) {
                    if (err) return next(err);
                    else {
                        res.render("main/product", {product: product, SimilarProducts: SimilarProducts});
                    }
                });
        }
    });
});

router.get("/offers", function (req, res, next) {
    Product.find({Status: "sale"}, function (err, offers) {
        if (err) return next(err);
        res.render("main/offers", {offers: offers});
    });
});

router.get("/newArrivals", function (req, res, next) {
    Product.find({Status: "new"}, function (err, newArrivals) {
        if (err) return next(err);
        res.render("main/newArrivals", {newArrivals: newArrivals});
    });
});


/* how to buy */
router.get("/how_to_buy", function (req, res, next) {
    res.render("main/how_to_buy");
});


/* contact-us */
router.get("/contact-us", function (req, res, next) {
    res.render("main/contact-us");
});
/* contact-us */

/* usage policy */
router.get("/UsagePolicy", function (req, res, next) {
    res.render("main/UsagePolicy");
});
/* usage policy */

/* usage policy */
router.get("/help", function (req, res, next) {
    res.render("main/help");
});
/* usage policy */
/* our maps */
router.get("/our-maps", function (req, res, next) {
    res.render("main/our-maps");
});
/* our maps */


/* this section for test */
var Expenses = require("../models/expenses");

router.get("/testForInsert", function (req, res, next) {
    res.render("testForInsert");
});

router.post("/testForInsert", function (req, res, next) {
    var NewExpensesTypes = new Expenses();
    NewExpensesTypes.name = "طوب من أجل السلم";
    NewExpensesTypes.cost = "3500";
    NewExpensesTypes.save(function () {
        res.render("testForInsert");
    });

});
/* this section for test */

module.exports = router;