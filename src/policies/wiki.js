const ApplicationPolicy = require("./application");

module.exports = class WikiPolicy extends ApplicationPolicy {

  new() {
    return this._isAdmin() || this._isPremium();
  }

  show(){
    return this._isAdmin() || this._isOwner() || (this._isCollaborator() && this._isPremium());
  }

  create() {
    return this.new();
  }

  edit() {
    return this.show();
  }

  update() {
    return this.edit() || this._isPremium();
  }

  destroy() {
    return this._isOwner() || this._isAdmin();
  }
}