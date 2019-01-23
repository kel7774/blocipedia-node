const userQueries = require("../db/queries.users.js");
const passport = require("passport");


module.exports = {
    signUp(req, res, next){
        res.render("users/sign_up");
    },
    create(req, res, next){
        let newUser = {
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            password_conf: req.body.password_conf
        };
        userQueries.createUser(newUser, (err, user) => {
            if(err){
                req.flash("error", err);
                res.redirect("/users/sign_up");
            } else {
                passport.authenticate("local")(req, res, () => {
                    req.flash("notice", "You've successfully signed in!");
                    res.redirect("/");
                })
            }
        });
    },
    signInForm(req, res, next){
        res.render("users/sign_in");
    },
    signIn(req, res, next){
        passport.authenticate("local")(req, res, function () {
            if(!req.user){
                req.flash("notice", "Sign in failed. Please try again.");
                res.redirect("/users/sign_in");
            } else {
                req.flash("notice", "You've successfully signed in!");
                res.redirect("/");
            }
        })
    },
    signOut(req, res, next){
        req.logout();
        req.flash("notice", "You've successfully signed out!");
        res.redirect("/");
    },
    show(req, res, next){
        userQueries.getUser(req.params.id, (err, user) => {
            if(err || user === undefined){
                req.flash("notice", "No user found with that ID.");
                res.redirect("/");
            } else {
                res.render("users/show", {user});
            }
        })
    },
    upgrade(req, res, next){
        var stripe = require("stripe")("pk_test_3qsvchieID6iBgXIBFaIm5mW");
        const token = req.body.stripeToken;
        const charge = stripe.charges.create({
            amount: 1500,
            currency: 'usd',
            description: 'Charging for premium account',
            source: token,
        });
        userQueries.upgrade(req.params.id, (err, user) => {
            if(err || user == null){
                res.redirect(401, "/");
            } else {
                req.flash("notice", "Your account has been upgraded!");
                res.redirect(`/users/${req.params.id}`);
            }
        })
    },
    downgrade(req, res, next){
        userQueries.downgrade(req, (err, user) => {
            if(err || user == null){
                req.flash("error", err);
                res.redirect(err, "/");
            } else {
                req.flash("notice", "You have successfully downgraded your account.");
                res.redirect(`/users/${req.params.id}`);
            }
        })
    }
}