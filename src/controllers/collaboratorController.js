const collaboratorQueries = require("../../src/db/queries.collaborators.js");

module.exports = {
    add(req, res, next){
        if(req.user){
            collaboratorQueries.addCollaborator(req, (err, collaborator) => {
                if(err) {
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
            collaboratorQueries.removeCollaborator(req.params.id, req,body.collabName, (err, collaborator) => {
                if(err){
                    req.flash("error", err);
                }
                req.flash("notice", "They have been removed as a collaborator.");
                res.redirect(req.headers.referer);
            });
        } else {
            req.flash("notice", "You must be signed in to do that.");
            res.redirect(req.headers.referer);
        }
    }
}