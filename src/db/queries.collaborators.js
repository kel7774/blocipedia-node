const Collaborator = require("./models").Collaborator;
const User = require("./models").User;

module.exports = {
    getAll(callback){
        return User.all({
            include: [{
                model: Collaborator,
                as: "collaborators"
            }]
        })
        .then((users) => {
            callback(null, users);
        })
        .catch((err) => {
            callback(err);
        });
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