const Collaborator = require("./models").Collaborator;
const User = require("./models").User;

module.exports = {
    addCollaborator(req, callback){
        User.findOne({
            where: {
                email: req.body.addCollaborator
            }
        })
        .then((user) => {
            if(!user){
                return callback("User not found.");
            } else if(user.id === req.user.id){
                return callback("You can't add yourself as a collaborator");
            }
            Collaborator.findOne({
                where: {
                    userId: user.id,
                    wikiId: req.params.id
                }
            })
            .then((collaborator) => {
                if(collaborator){
                    console.log("user already collab success");
                    return callback("User is already a collaborator.");
                }
                return Collaborator.create({
                    wikiId: req.params.id,
                    userId: user.id
                })
                .then((collaborator) => {
                    callback(null, collaborator);
                })
                .catch((err) => {
                    console.log(err);
                    callback(null, err);
                })
            })
            .catch((err) => {
                console.log(err);
                callback(null, err);
            })
        })
        .catch((err) => {
            console.log(err);
            callback(null, err);
        })
    },

    removeCollaborator(req, callback){
        return Collaborator.findOne({
            where: {
                wikiId: wikiId,
                userId: userId
            }
        })
        .then((collaborator) => {
            if(collaborator) {
                Collaborator.destroy({
                    where: {
                        id: collaborator.id
                    }
                })
                .then((collaborator) => {
                    callback(null, collaborator);
                })
                .catch((err) => {
                    console.log(err);
                    callback(err);
                })
            } else {
                callback("error", "Collaborator is no longer on this wiki.");
            }
        })
        .catch((err) => {
            console.log(err);
            callback(err);
        })
    }
}