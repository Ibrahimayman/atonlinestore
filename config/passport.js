var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy; // for local login.
var faceboookStrategy = require("passport-facebook").Strategy;
var twitterStrategy = require("passport-twitter").Strategy;
var secret = require("../config/secret");
var User = require('../models/user');
var Cart = require("../models/cart");
var async = require("async");

// serialize and deserialize
passport.serializeUser(function (user, done) {
    done(null, user._id);
});

passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
        done(err, user);
    });
});

//Middleware name it with any name like:  'local-login'
passport.use('local-login', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, function (req, email, password, done) {
    User.findOne({email: email}, function (err, user) {
        if (err) return done(err);

        if (!user) {
            return done(null, false, req.flash('error', 'عفوا : لا يوجد مستخدم بهذه البيانات'));
        }
        if (!user.comparePasswords(password)) {
            return done(null, false, req.flash('error', 'خطأ فى الرقم السري'));
        }
        return done(null, user);
    });
}));

//Middleware name it with any name like:  'facebook'
// login by facebook.
passport.use('facebook', new faceboookStrategy(secret.facebook, function (token, refreshToken, profile, done) {
    User.findOne({facebook: profile.id}, function (err, user) {
        if (err) return done(err);
        if (user) {
            return done(null, user);
        }
        else {
            async.waterfall([
                function (callback) {
                    var newUser = new User();
                    newUser.email = profile.emails[0].value;
                    newUser.facebook = profile.id;
                    newUser.tokens.push({kind: "facebook", token: token});
                    newUser.profile.name = profile.displayName;
                    newUser.profile.picture = 'http://graph.facebook.com/' + profile.id + "/picture?type=large";

                    newUser.save(function (err) {
                        if (err) throw  err;
                        callback(err, newUser);
                    })
                },
                function (newUser) {
                    // create cart for every new user for the first time.
                    var cart = new Cart();
                    cart.owner = newUser._id;
                    cart.save(function (err) {
                        if (err) return done(err);
                        return done(err, newUser);
                    });
                }
            ])
        }
    })
}));


// login by twitter.
passport.use('twitter', new twitterStrategy(secret.twitter, function (token, refreshToken, profile, done) {
    User.findOne({twitter: profile.id}, function (err, user) {
        if (err) return done(err);
        if (user) {
            return done(null, user);
        }
        else {
            async.waterfall([
                function (callback) {
                    var newUser = new User();
                    newUser.emial = profile._json.email;
                    newUser.twitter = profile.id;
                    newUser.tokens.push({kind: "twitter", token: token});
                    newUser.profile.name = profile.displayName;
                    newUser.profile.picture = profile._json.profile_image_url;

                    newUser.save(function (err) {
                        if (err) throw  err;
                        callback(err, newUser);
                    })
                },
                function (newUser) {
                    // create cart for every new user for the first time.
                    var cart = new Cart();
                    cart.owner = newUser._id;
                    cart.save(function (err) {
                        if (err) return done(err);
                        return done(err, newUser);
                    });
                }
            ])
        }
    })
}));

//custom function to validate
exports.isAuthenticated = function (req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
};
