const Wiki = require("./models").Wiki;
const Public = require("../policies/application");
const Private = require("../policies/wiki");

module.exports = {
    getAllWikis(callback){
        return Wiki.all()
        .then((wikis) => {
            callback(null, wikis);
        })
        .catch((err) => {
            callback(err);
        })
    },
    addWiki(newWiki, callback){
        return Wiki.create({
            title: newWiki.title,
            body: newWiki.body,
            userId: newWiki.userId,
            private: newWiki.private
        })
        .then((wiki) => {
            callback(null, wiki);
        })
        .catch((err) => {
            callback(err);
        })
    },
    getWiki(id, callback){
        return Wiki.findById(id)
        .then((wiki) => {
            callback(null, wiki);
        })
        .catch((err) => {
            callback(err);
        })
    },
    deleteWiki(req, callback) {
        return Wiki.findById(req.params.id)
        .then((wiki) => {
            wiki.destroy()
            .then((res) => {
                callback(null, wiki);
            });
        })
        .catch((err) => {
            callback(err);
        });
      },
    updateWiki(req, updatedWiki, callback){
        return Wiki.findById(req.params.id)
        .then((wiki) => {
            if(!wiki){
                return callback('No wiki found.');
            }
            let authorized;
            if(wiki.private == false){
                authorized = new Public(req.user, wiki).update();
            } else {
                authorized = new Private(req.user, wiki).update();
            }
            if(authorized){
                wiki.update(updatedWiki, {
                    fields: Object.keys(updatedWiki)
                })
                .then(() => {
                    callback(null, wiki);
                })
                .catch((err) => {
                    callback(err);
                });
            } else {
                req.flash("notice", "You are not authorized to do that.");
                callback("This action is forbidden.");
            }
        });
    }
}