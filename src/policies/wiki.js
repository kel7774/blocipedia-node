const ApplicationPolicy = require("./application");
const Collaborator = require("../db/models").Collaborator;

module.exports = class WikiPolicy extends ApplicationPolicy {

  constructor(user, record){
      super();
      this.user = user;
      this.record = record;
  }

  _isCollaborator(){
    let collaborator = Collaborator.findOne({
        where: {
          userId: this.user.userId,
          wikiId: this.record.wikiId
      }
    });
    return collaborator;
  }

  new() {
    return this._isAdmin() || this._isPremium();
  }

  create() {
    return this.new();
  }

  show(){
    return this._isAdmin() || this._isOwner() || (this._isCollaborator() && this._isPremium());
  }

  edit() {
    return this.show();
  }

  update() {
    return this.edit();
  }

  destroy() {
    return this._isOwner() || this._isAdmin();
  }
}