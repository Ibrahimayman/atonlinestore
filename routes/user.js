var router = require("express").Router(),
    User = require("../models/user"),
    Cart = require("../models/cart"),
    passport = require("passport"),
    crypto = require("crypto"),
    async = require("async");

var passportConf = require("../config/passport");

router.get('/signup', function (req, res, next) {
    if (req.user) return res.redirect("/");
    res.render('accounts/signup', {
        errors: req.flash('errors')
    });
});

router.post('/login', passport.authenticate('local-login', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
}));

router.get("/login", function (req, res) {
    if (req.user) return res.redirect("/");
    res.render("accounts/login", {
        message: req.flash('loginMessage')
    });
});

router.get('/profile', passportConf.isAuthenticated, function (req, res, next) {
    User
        .findOne({_id: req.user._id})
        .populate('history.item')
        .exec(function (err, foundUser) {
            if (err) return next(err);

            res.render('accounts/profile', {user: foundUser});
        });
});


router.get('/api/profile/setBirthDate', passportConf.isAuthenticated, function (req, res, next) {
    User
        .findOne({_id: req.user._id}, function (err, foundUser) {
            if (err) return next(err);
            res.send(foundUser);
        });
});


router.post('/profile', passportConf.isAuthenticated, function (req, res, next) {
    User.findOne({_id: req.user._id}, function (err, user) {

        if (err) return next(err);

        if (req.body.name) {
            user.profile.name = req.body.name;
        }
        if (req.body.address) {
            user.address = req.body.address;
        }
        if (req.body.mobile) {
            user.profile.mobile = req.body.mobile;
        }
        if (req.body.sex) {
            user.profile.sex = req.body.sex;
        }

        if (req.body.day) {
            var day = req.body.day
        }
        if (req.body.month) {
            var month = req.body.month
        }
        if (req.body.year) {
            var year = req.body.year
        }

        var dateOfBirth = new Date(year, month, day);

        user.profile.dateOfBirth = dateOfBirth;

        user.save(function (err) {
            if (err) return next(err);
            req.flash('success', 'تم حفظ البيانات بنجاح');
            return res.redirect('/profile');
        });
    });
});

router.post('/signup', function (req, res, next) {
    async.waterfall([
        function (callback) {
            var user = new User();
            user.profile.name = req.body.name;
            user.email = req.body.email;
            user.password = req.body.password;
            user.profile.picture = user.gravatar();

            User.findOne({email: req.body.email}, function (err, existingUser) {
                if (existingUser) {
                    req.flash('error', 'الحساب موجود من قبل');
                    return res.redirect('/signup');
                } else {
                    user.save(function (err, user) {
                        if (err) return next(err);
                        callback(null, user);
                    });
                }
            });
        },
        function (user) {
            var cart = new Cart();
            cart.owner = user._id;
            cart.save(function (err) {
                if (err) return next(err);
                req.logIn(user, function (err) {
                    if (err) return next(err);
                    res.redirect('/');
                });
            });
        }
    ]);
});

router.get("/logout", function (req, res, next) {
    req.logOut();
    res.redirect("./");
});

router.get('/edit-profile', function (req, res, next) {
    res.render('accounts/edit-profile', {message: req.flash('success')});
});

router.post('/edit-profile', function (req, res, next) {
    User.findOne({_id: req.user._id}, function (err, user) {

        if (err) return next(err);

        if (req.body.name) user.profile.name = req.body.name;
        if (req.body.address) user.address = req.body.address;

        user.save(function (err) {
            if (err) return next(err);
            req.flash('success', 'Successfully Edited your profile');
            return res.redirect('/edit-profile');
        });
    });
});

// facebook Routers
router.get("/auth/facebook", passport.authenticate('facebook', {scope: 'email'}));

router.get("/auth/facebook/callback", passport.authenticate('facebook', {
    successRedirect: '/',
    failureRedirect: '/login'
}));

// Twitter Routers
router.get("/auth/twitter", passport.authenticate('twitter', {scope: 'email'}));

router.get("/auth/twitter/callback", passport.authenticate('twitter', {
    successRedirect: '/',
    failureRedirect: '/login'
}));

module.exports = router;