const User = require("./models").User;
const bcrypt = require("bcryptjs");
const sgMail = require("@sendgrid/mail");

module.exports = {
    createUser(newUser, callback){
        const salt = bcrypt.genSaltSync();
        const hashedPassword = bcrypt.hashSync(newUser.password, salt);

        return User.create({
            name: newUser.name,
            email: newUser.email,
            password: hashedPassword
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
    }
}