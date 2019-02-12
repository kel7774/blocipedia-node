'use strict';
module.exports = (sequelize, DataTypes) => {
  var User = sequelize.define('User', {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        isEmail: { msg: "must be a valid email" }
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    role: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: "standard"
    },
  }, {});
  User.associate = function(models) {
    User.hasMany(models.Wiki, {
      foreignKey: "userId",
      as: "wikis"
    });
    User.hasMany(models.Collaborator, {
      foreignKey: "userId",
      as: "collaborators"
    });
  };
  User.prototype.isAdmin = function(){
    return this.role === "admin";
  };
  User.prototype.isPremium = function(){
    return this.role === 'premium';
  };
  User.prototype.isOwner = function(){
    return this.role === "owner";
  }
  User.prototype.isStandard = function(){
    return this.role = "standard";
  }
  User.prototype.isCollaborator = function(user, record){
    let collab = 0;
    record.collaborators.forEach((collab) => {
      if(collab.userId == user.id){
        collab++;
      }
    });
    return collab > 0;
  }
  return User;
};