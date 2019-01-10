module.exports = {
    validateUsers(req, res, next){
        if(req.method === "POST"){
            req.checkBody("name", "Must be at least 2 characters in length").isLength({min: 2})
            req.checkBody("email", "Must be valid").isEmail();
            req.checkBody("password", "Must be at least 6 characters in length").isLength({min: 6})
            req.checkBody("password_conf", "Must match password provided").optional().matches(req.body.password)
        }
        const errors = req.validationErrors();
        console.log(errors);
        if(errors){
            req.flash("error", errors);
            return res.redirect(req.headers.referer);
        } else {
            return next();
        }
    }
}