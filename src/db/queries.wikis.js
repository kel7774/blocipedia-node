const Wiki = require("./models").Wiki;
const User = require("./models").User;
const Collaborator = require("./models").Collaborator;
const Private = require("../policies/wiki");
const Public = require("../policies/application");


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
    addWiki(newWiki, callback) {
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
       return Wiki.findById(id, {
           include: [{
               model: Collaborator, as: "collaborators"
           }]
       })
       .then((wiki) => {
           callback(null, wiki);
       })
       .catch((err) => {
           console.log(err);
           callback(err);
       })
    },
    deleteWiki(req, callback) {
        return Wiki.findById(req.params.id)
        .then((wiki) => {
            let authorized;
            if(!req.body.private || req.body.private == false){
                authorized = new Public(req.user, wiki).destroy();
            } else {
                authorized = new Private(req.user, wiki).destroy();
            }
            if(authorized){
                return wiki.destroy()
                .then((res) => {
                    callback(null, wiki);
                })
            } else {
                req.flash("notice", "You are not authorized to do that.");
                callback(401);
            }
        })
        .catch((err) => {
            callback(err);
        })
      },
      updateWiki(req, updatedWiki, callback){
          return Wiki.findById(req.params.id)
          .then((wiki) => {
              if(!wiki){
                  return callback("Wiki not found.");
              }
              wiki.update(updatedWiki, {
                  fields: Object.keys(updatedWiki)
              })
              .then(() => {
                  callback(null, wiki);
              })
              .catch((err) => {
                  callback(err);
              });
          });
      }
}