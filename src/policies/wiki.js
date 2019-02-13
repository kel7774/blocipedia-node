const ApplicationPolicy = require("./application");

module.exports = class WikiPolicy extends ApplicationPolicy {

  new() {
    return this.user != null;
  }

  show(){
      return this._isStandard() || this._isAdmin() || this._isOwner() || this._isPremium();
  }

  create() {
    return this.new();
  }

  edit() {
    return this._isStandard() || this._isAdmin() || this._isPremium();
  }

  update() {
    return this.edit() && this._isPremium();
  }

  destroy() {
    return this._isOwner() || this._isAdmin();
  }
}