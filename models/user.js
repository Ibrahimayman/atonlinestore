/**
 * Created by Ibrahim Ayman on 01/07/2017.
 */

var mongoose = require("mongoose"),
    bcrypt = require("bcryptjs"),
    crypto = require("crypto"),
    passwordHash = require('password-hash'),
    Schema = mongoose.Schema,
    config = require("../config/secret");

/*------------ the user schema attributes / characteristics / fields  ------------*/

var UserSchema = new Schema({
    email: {type: String, unique: true, lowercase: true},
    password: {type: String},
    facebook: {type: String},
    twitter: {type: String},
    tokens: Array,
    roles: {
        admin: {type: mongoose.Schema.Types.ObjectId, ref: 'Admin'},
        account: {type: mongoose.Schema.Types.ObjectId, ref: 'Account'}
    },
    profile: {
        name: {type: String, default: ''},
        picture: {type: String, default: ''},
        mobile: {type: String},
        sex: {type: String},
        dateOfBirth: {type: Date}
    },
    address: {type: String},
    history: [{
        date: {type: Date},
        paid: {type: Number, default: 0},
        item: {type: Schema.Types.ObjectId, ref: 'Product'}
    }],
    timeCreated: {type: Date, default: Date.now},
    isActive: {type: String, default: 'yes'},
});

UserSchema.methods.canPlayRoleOf = function (role) {
    if (role === "admin" && this.roles.admin) {
        return true;
    }

    if (role === "account" && this.roles.account) {
        return true;
    }

    return false;
};

UserSchema.methods.defaultReturnUrl = function () {
    var returnUrl = '/';
    if (this.canPlayRoleOf('account')) {
        returnUrl = '/account/';
    }

    if (this.canPlayRoleOf('admin')) {
        returnUrl = '/admin/';
    }

    return returnUrl;
};

/*hash the password before we even save it to the db.*/

UserSchema.pre('save', function (next) {
    var user = this;
    if (user.password === "" || user.password === undefined) {
        return next();
    }
    else {
        var hashedPassword = passwordHash.generate(user.password);
        user.password = hashedPassword;
        return next();
    }

});

/*compare password in the db and the one that the user type in*/
UserSchema.methods.comparePasswords = function (password) {
    return passwordHash.verify(password, this.password);
};

UserSchema.methods.gravatar = function (size) {
    if (!this.size) size = 200;
    if (!this.email) return 'https://gravatar.com/avatar/?s' + size + '&d=retro';
    var md5 = crypto.createHash('md5').update(this.email).digest('hex');
    return 'https://gravatar.com/avatar/' + md5 + '?s=' + size + '&d=retro';
};

UserSchema.methods.sendRegistrationEmail = function (req, res, options) {
    req.app.utility.sendmail(req, res, {
        from: config.smtp.from.name + ' <' + config.smtp.from.address + '>',
        to: options.email,
        subject: config.projectName + ' شكرا لتسجيلك فى ',
        textPath: '../views/accounts/email-text',
        htmlPath: '../views/accounts/email-html',
        success: function () {
            options.onSuccess();
        },
        error: function (err) {
            options.onError(err);
        }
    });
};

module.exports = mongoose.model("User", UserSchema);