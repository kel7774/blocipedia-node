const User = require("./models").User;
const Collaborator = require("./models").Collaborator;
const bcrypt = require("bcryptjs");
const sgMail = require("@sendgrid/mail");

module.exports = {
    createUser(newUser, callback){
        const salt = bcrypt.genSaltSync();
        const hashedPassword = bcrypt.hashSync(newUser.password, salt);

        return User.create({
            name: newUser.name,
            email: newUser.email,
            password: hashedPassword,
            role: 'standard'
        })
        .then((user) => {
            sgMail.setApiKey(process.env.SENDGRID_API_KEY);
            const msg = {
                to: user.email,
                from: "kelli@waitrapp.com",
                subject: "Welcome to Blocipedia!",
                text: `Hi ${user.name}, Welcome to Blocipedia!`,
                html: `<strong>Welcome to Blocipedia, ${user.name}!</strong>`
            };
            sgMail.send(msg);
            callback(null, user);
        })
        .catch((err) => {
            callback(err);
        })
    },
    upgrade(id, callback){
        return User.findById(id)
        .then((user) => {
            if(!user){
                return callback("User not found.");
            } else {
                return user.update({role: 'premium'})
                .then(() => {
                    callback(null, user);
                })
                .catch((err) => {
                    callback(err);
                });
            }
        });
    },
    downgrade(req, callback){
        return User.findById(req.params.id)
        .then((user) => {
            if(!user){
                return callback("User not found");
            } else {
                user.update({role: "standard"})
                .then((user) => {
                    Wiki.findAll({where: {userId: user.id}})
                    .then((wikis) => {
                        wikis.forEach((wiki) => {
                            wiki.update({private: false});
                        })
                    })
                    .then(() => {
                        callback(null, user);
                    })
                    .catch((err) => {
                        callback(err);
                    })
                })
                .catch((err) => {
                    callback(err);
                });
            }
        });
    },
    getUser(id, callback){
        let result = {};
        User.findById(id)
        .then((user) => {
            if(!user){
                callback(404);
            } else {
                result["user"] = user;
                Collaborator.scope({
                    method: ["userCollaborationsFor", id]
                }).all()
                .then((collaborations) => {
                    result["collaborations"] = collaborations;
                    callback(null, result);
                })
                .catch((err) => {
                    callback(err);
                })
            }
        })
    }
}