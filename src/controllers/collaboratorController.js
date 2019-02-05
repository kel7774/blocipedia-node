const collaboratorQueries = require("../../src/db/queries.collaborators.js");
const wikiQueries = require("../../src/db/queries.wikis.js");
const Authorized = require("../policies/application");

module.exports = {
    show(req, res, next){
        wikiQueries.getWiki(req.params.wikiId, (err, result) => {
            wiki = result["wiki"];
            collaborators = result["collaborators"];
            if(err || wiki == null) {
                res.redirect(404, "/");
            } else {
                const authorized = new Authorized(req.user, wiki, collaborators).edit();
                if(authorized){
                    res.render("collaborators/show", {wiki, collaborators});
                } else {
                    req.flash("notice", "You are not authorized to do that.");
                    res.redirect(`/wikis/${req.params.wikiId}`);
                }
            }
        });
    },
    create(req, res, next){
        collaboratorQueries.createCollaborator(req, (err, collaborator) => {
            if(err){
                req.flash("notice", "User already exists.");
            }
            res.redirect(`/wikis/${req.params.wikiId}/collaborators`);
        });
    },
    destroy(req, res, next){
        if(req.user){
            collaboratorQueries.deleteCollaborator(req, (err, collaborator) => {
                if(err){
                    req.flash("error", err);
                }
                res.redirect(req.headers.referer);
            });
        } else {
            req.flash("notice", "You must be signed in to do that.");
            res.redirect(req.headers.referer);
        }
    }
}