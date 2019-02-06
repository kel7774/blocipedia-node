const collaboratorQueries = require("../../src/db/queries.collaborators.js");
const Authorized = require("../policies/application");
const wikiQueries = require("../db/queries.wikis");

module.exports = {
    show(req, res, next){
        wikiQueries.getWiki(req.params.wikiId, (err, result) => {
            wiki = result["wiki"];
            collaborators = result["collaborators"];
            if(err || wiki == null){
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
        })
    },
    create(req, res, next){
        collaboratorQueries.addCollaborator(req, (err, collaborator) => {
            if(err){
                req.flash("notice", "User already exists")
            }
            res.redirect(`/wikis/${req.params.wikiId}/collaborators`);
        })
    },
    destroy(req, res, next){
        if(req.user){
            collaboratorQueries.removeCollaborator(req, (err, collaborator) => {
                if(err){
                    req.flash("error", err);
                }
                res.redirect(req.headers.referer);
            })
        } else {
            req.flash("notice", "You must be signed int to perform this action.");
            res.redirect(req.headers.referer);
        }
    }
}