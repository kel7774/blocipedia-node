const ApplicationPolicy = require("./application");
const collaborator = require("../db/models").Collaborator;

module.exports = class WikiPolicy extends ApplicationPolicy {

  _isCollaborator(){
    let collaborator = Collaborator.findOne({
        where: {
          userId: user.id,
          wikiId: wikiId.id
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
    return this._isAdmin() || this._isOwner() || this._isCollaborator();
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