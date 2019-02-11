const userQueries = require("../db/queries.users.js");
const passport = require("passport");
const stripe = require("stripe")("pk_test_3qsvchieID6iBgXIBFaIm5mW");
const flash = require("express-flash");
const express = require("express");

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
                console.log(err);
                console.log("There was an error creating the user, redirecting to signup page");
                req.flash("error", "A user already exists with this email.");
                res.redirect("/users/sign_up");
            } else if(newUser == user){
                console.log("newUser is equal to user");
                userQueries.isRepeatEmail(newUser.email, (err, user) => {
                    if(err){
                        console.log("Checking if email is a repeat.");
                        req.flash("error", err);
                        res.redirect("/users/sign_up");
                    } else {
                        console.log("That user already exists, redirecting to sign in page");
                        req.flash("notice", "You already have an account. Please sign in.");
                        res.redirect("/users/sign_in");
                    }
                })
            } else {
                console.log("newUser is not equal to user");
                passport.authenticate("local")(req, res, () => {
                    req.flash("notice", "You've successfully signed in!");
                    res.redirect("/");
                })
            }
        })
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