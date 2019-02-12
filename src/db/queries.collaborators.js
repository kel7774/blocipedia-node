const Collaborator = require("./models").Collaborator;

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
    removeCollaborator(req, collabName, callback){
        return Collaborator.findOne({
            where: {
                wikidId: wikiId,
                collabName: collabName
            }
        })
        .then((collab) => {
            if(collab){
                Collaborator.destroy({
                    where: {
                        id: collab.id
                    }
                })
                .then((collab) => {
                    callback(null, collab);
                })
                .catch((err) => {
                    callback(err);
                })
            } else {
                callback("error", "Collaborator no longer exists for this wiki.");    
            }
        })
        .catch((err) => {
            callback(err);
        })
    }
}