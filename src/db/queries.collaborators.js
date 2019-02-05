const Collaborator = require("./models").Collaborator;
const User = require("./models").User;
const Wiki = require("./models").Wiki;
const Authorized = require("../policies/application");

module.exports = {
    createCollaborator(req, callback){
        User.findOne({
            where: {
                username: req.body.username
            }
        })
        .then((user) => {
            if(!user){
                return callback("User does not exist.")
            }
            Collaborator.findOne({
                where: {
                    userId: user.id,
                    wikiId: req.params.wikiId
                }
            })
            .then((collaborator) => {
                if(collaborator) {
                    return callback("this user is already a collaborator on this wiki.");
                }
                let newCollab = {
                    userId: user.id,
                    wikiId: req.params.wikiId
                };
                return Collaborator.create(newCollab)
                .then((collaborator) => {
                    callback(null, collaborator);
                })
                .catch((err) => {
                    callback(err, null);
                })
            })
        })
    },
    deleteCollaborator(req, callback){
        let userId = req.body.collaborator;
        let wikiId = req.params.wikiId;

        const authorized = new Authorizer(req.user, wiki, userId).destroy();

        if(authorized){
            Collaborator.destroy({
                where: {
                    userId: userId,
                    wikiId: wikiId
                }
            })
            .then((deleteRecordsCount) => {
                callback(null, deleteRecordsCount);
            })
            .catch((err) => {
                callback(err);
            });
        } else {
            req.flash("notice", "You are not authorized to do that.");
            callback(401);
        }
    }
}