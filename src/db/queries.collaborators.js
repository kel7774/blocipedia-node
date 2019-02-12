const Collaborator = require("./models").Collaborator;
const User = require("./models").User;

module.exports = {
    getAll(wikiId, callback){
        return Collaborator.findAll(
            {where: {wikiId: wikiId}}
        )
        .then((collaborators) => {
            callback(null, collaborators);
        })
        .catch((err) => {
            callback(err);
        })
    },
    addCollaborator(newCollab, callback){
        return Collaborator.create({
            userId: newCollab.userId,
            wikiId: newCollab.wikiId
        })
        .then((collaborator) => {
            callback(null, collaborator);
        })
        .catch((err) => {
            callback(err);
        });
    },
    removeCollaborator(req, collaboratorInfo, callback){

    }
}