const userQueries = require("../db/queries.user");
const passport = require("passport");
const sgMail = require('@sendgrid/mail');

module.exports = {
    signUp(req, res, next){
        res.render("users/sign_up");
    },
    create(req, res, next){
        let newUser = {
            email: req.body.email,
            password: req.body.password,
            passwordConfirmation: req.body.passwordConfirmation
        };
        userQueries.createUser(newUser, (err, user) => {
            if(err){
                req.flash("error", err);
                res.redirect("/users/sign_up");
            } else {
                passport.authenticate("local")(req, res, () => {
                    req.flash("notice", "You've successfully signed in!");
                    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
                    const msg = {
                        to: user.email,
                        from: 'kelli@waitrapp.com',
                        subject: 'Welcome to Blocipedia!',
                        text: `Hi ${user.name}, thanks for signing up with Blocipedia!`,
                        html: `<strong>enjoy!</strong>`,
                    };
                    sgMail.send(msg);
                    res.redirect("/");
                })
            }
        });
    }
}