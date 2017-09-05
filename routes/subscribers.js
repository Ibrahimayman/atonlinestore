var router = require("express").Router(),
    Subscribers = require("../models/subscribers");


router.post('/api/subscribers/subscribe/', function (req, res) {

    Subscribers.findOne({email: req.body.email}, function (err, existingUser) {
        if (existingUser) {
            res.send({type : "warning" , message : "عفوا تم الاشتراك مسبقا فى النشرة البريدية"});
        } else {
            const newSubscribers = new Subscribers();
            newSubscribers.email = req.body.email.trim();

            newSubscribers.save(function (err) {
                if (err) return res.send(err);
                res.send({type : "success" , message : "شكرا لاشتراكك فى النشرة البريدية"});
            });
        }
    });

});

module.exports = router;