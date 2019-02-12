const collaboratorQueries = require("../../src/db/queries.collaborators.js");
const wikiQueries = require("../../src/db/queries.wikis.js");

module.exports = {
    show(req, res, next){
        collaboratorQueries.getAll((err, users) => {
            if(err){
                res.redirect(500, "static/index");
            } else {
                res.render("collaborators/show", {users});
            }
        });
    },
    newForm(req, res, next){
        res.render("collaborators/show");
    },
    create(req, res, next){
        let newCollab = {
            userId: req.body.userId,
            wikiId: req.body.wikiId
        };
        collaboratorQueries.addCollaborator(newCollab, (err, collaborator) => {
            if(err){
                req.flash("error", err);
                res.redirect(500, "collaborators/show");
            } else {
                req.flash("notice", "You have been added as a collaborator");
                res.redirect("/wikis/:id/collaborators");
            }
        });
    }
}