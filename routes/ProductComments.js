var router = require("express").Router(),
    ProductComments = require("../models/productComments");

/* visitors and users comments on the product */
router.post('/api/product/saveComment', function (req, res, next) {
    var ProductComment = new ProductComments({
        comment: req.body.comment,
        product: req.body.product,
        Email: req.body.Email,
        visitorName: req.body.visitorName,
        user: req.body.user
    });
    ProductComment.save(function (err, response) {
        if (err) return next(err);
        res.send({type: "success", message: "شكرا علي تقييمك لهذا المنتج"});
    })
});

/* get all comments for specific product */
router.get('/api/product/comments/:id', function (req, res, next) {
    ProductComments.find({product: req.params.id}).populate("user").exec(function (err, comments) {
        if (err) return next(err);
        res.send(comments);
    })
});

module.exports = router;