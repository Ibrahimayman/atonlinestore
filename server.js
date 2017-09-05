/*** Created by Ibrahim Ayman on 01/07/2017.*/
'use strict';

var express = require('express'),
    morgan = require("morgan"),
    mongoose = require("./server/db/mongoose"),
    bodyParser = require("body-parser"),      // convert body to what ever you want.
    ejs = require("ejs"),
    engine = require("ejs-mate"),
    path = require('path'),
    session = require("express-session"),
    cookieParser = require("cookie-parser"),
    flash = require("express-flash"),
    // toastr = require('express-toastr');
    secret = require("./config/secret"),
    MongoStore = require("connect-mongo/es5")(session),   //save session data in Mongo DB.
    passport = require("passport"),
    formidable = require("express-formidable"),
    expressValidator = require('express-validator'),
    favicon = require('serve-favicon'),
    stripe = require("stripe")('sk_test_90yMCyP0kAVCmeJSs22PDx2m');

var Category = require("./models/category");
var cartLentgh = require("./middlewares/middlewares");


var app = express();
app.use("/public", express.static(path.join(__dirname, 'public')));
app.use(morgan("dev"));  // middleware used to log when you made an http verb. used to log any res or req.
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
// app.use(formidable());
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
// validator Middleware
app.use(expressValidator({
    errorFormatter: function (param, msg, value) {
        var namespace = param.split('.')
            , root = namespace.shift()
            , formParam = root;
        while (namespace.length) {
            formParam += '[' + namespace.shift() + ']';
        }
        return {
            param: formParam,
            msg: msg,
            value: value
        };
    }
}));

app.engine('ejs', engine);
app.set('view engine', 'ejs');
app.use(cookieParser());
app.use(session({
    resave: true,
    saveUninitialized: true,
    secret: secret.secretKey,
    store: new MongoStore({url: secret.database, autoReconnect: true})
}));

/* flash messages */
app.use(flash());
// app.use(toastr()); //toastr plugin for backend.
app.use(require('connect-flash')());
app.use(function (req, res, next) {
    res.locals.messages = require('express-messages')(req, res);
    next();
});
app.use(passport.initialize());
app.use(passport.session());

app.use(function (req, res, next) {  // every route have a user object.
    res.locals.user = req.user;
    next();
});

app.use(function (req, res, next) {  // get all categories.
    Category.find({}, function (err, categories) {
        if (err) return next(err);
        res.locals.categories = categories;
        next();
    })
});
app.use(cartLentgh);

//setup utilities
app.utility = {};
app.utility.sendmail = require('./util/sendmail');
app.utility.slugify = require('./util/slugify');
app.utility.workflow = require('./util/workflow');


/* Application Routes */
function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.set('X-Auth-Required', 'true');
    req.session.returnUrl = req.originalUrl;
    res.redirect('/login/');
}

function ensureAdmin(req, res, next) {
    if (req.user.canPlayRoleOf('admin')) {
        return next();
    }
    res.redirect('/');
}

app.param('id', function(request, response, next, id){
    // Do something with id
    // Store id or other info in req object
    // Call next when done
    next();
});

var mainRoutes = require("./routes/main"),
    userRoutes = require("./routes/user"),
    adminRoutes = require("./routes/admin"),
    categoryRoutes = require("./routes/category"),
    productRoutes = require("./routes/product"),
    subscribeRoutes = require("./routes/subscribers"),
    billRoutes = require("./routes/Bill"),
    ExpensesRoutes = require("./routes/Expenses"),
    productComments = require("./routes/ProductComments"),
    apiRoutes = require('./api/api');

app.use(mainRoutes);
app.use(userRoutes);
app.use(subscribeRoutes);
app.use(productComments);
app.use('/api', apiRoutes);


app.all('/admin*', adminRoutes, ensureAdmin);
app.use('/admin', adminRoutes, ensureAdmin);

app.all('/admin*', categoryRoutes, ensureAdmin);
app.use('/admin', categoryRoutes, ensureAdmin);

app.all('/admin*', ExpensesRoutes, ensureAdmin);
app.use('/admin', ExpensesRoutes, ensureAdmin);


app.all('/admin*', productRoutes, ensureAdmin);
app.use('/admin', productRoutes, ensureAdmin);

app.all('/admin*', billRoutes, ensureAdmin);
app.use('/admin', billRoutes, ensureAdmin);


app.listen(process.env.PORT || 3000, function(){
    console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});

