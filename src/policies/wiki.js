const ApplicationPolicy = require("./application");

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
    return this._isAdmin() || this._isPremium() || this._isCollaborator();
  }

  update() {
    return this.edit() && this._isPremium() || this._isCollaborator();
  }

  destroy() {
    return this._isOwner() || this._isAdmin();
  }
}