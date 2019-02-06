const Collaborator = require("./models").Collaborator;
const Authorized = require("../policies/application");
const Wiki = require("./models").Wiki;
const User = require("./models").User;

module.exports = {
    addCollaborator(req, callback){
       User.findOne({
           where: {
               name: req.body.name
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
               if(collaborator){
                   return callback("This user is already a collaborator on this wiki.");
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
    removeCollaborator(req, callback){
        let collaboratorId = req.body.collaborator;
        let wikiId = req.params.wikiId;
        const authorized = new Authorized(req.user, wikiId, collaboratorId).destroy();
        if(authorized){
            Collaborator.destroy({
                where: {
                    userId: userId,
                    wikiId: wikiId
                }
            })
            .then((deletedRecordsCount) => {
                callback(null, deletedRecordsCount);
            })
            .catch((err) => {
                callback(err);
            })
        } else {
            req.flash("notice", "You are not authorized to do that.");
            callback(401);
        }
    }
}