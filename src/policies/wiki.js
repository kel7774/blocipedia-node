const ApplicationPolicy = require("./application");


// this is for if the wiki has been set to private AND if the user is a collaborator

module.exports = class WikiPolicy extends ApplicationPolicy {

  new() {
    return this._isAdmin() || this._isPremium();
  }

  show(){
    return this._isAdmin() || this._isOwner() || this._isCollaborator();
  }

  create() {
    return this.new();
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