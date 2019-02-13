const collaboratorQueries = require("../../src/db/queries.collaborators.js");
const Authorized = require("../policies/application");

module.exports = {
    add(req, res, next){
        if(req.user){
            collaboratorQueries.addCollaborator(req, (err, collaborator) => {
                if(err) {
                    console.log(err);
                    req.flash("error", err);
                }
                res.redirect(req.headers.referer);
            })
        } else {
            req.flash("notice", "You must be signed in to complete this action.");
            res.redirect(req.headers.referer);
        }
    },
    remove(req, res, next){
        if(req.user){
            const authorized = new Authorized(req.params.userId).destroy();
            if(authorized){
                collaboratorQueries.removeCollaborator(req, (err, collaborator) => {
                    if(err){
                        req.flash("error", err);
                    }
                    res.redirect(req.headers.referer);
                })
            } else {
                req.flash("notice", "Sign in to complete this action.");
                res.redirect(req.headers.referer);
            }
        }
    }
}