const collaboratorQueries = require("../../src/db/queries.collaborators.js");

module.exports = {
    show(req, res, next){
        collaboratorQueries.getAll(req.params.id, (err, collaborators) => {
            if(err){
                res.redirect(500, "static/index");
            } else {
                res.render("collaborators/show", {collaborators});
            }
        });
    },
    create(req, res, next){
        let newCollab = {
            userId: req.body.userId,
            wikiId: req.body.wikiId
        };
        collaboratorQueries.addCollaborator(newCollab, (err, collaborator) => {
            if(err) {
                req.flash("error", err);
                res.redirect(500, "collaborators/show");
            } else {
                req.flash("notice", "Added as a collaborator");
                res.redirect("/wikis/:id/collaborators");
            }
        });
    },
    destroy(req, res, next){
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