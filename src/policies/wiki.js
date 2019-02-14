const ApplicationPolicy = require("./application");

module.exports = class WikiPolicy extends ApplicationPolicy {

  new() {
    return this._isAdmin() || this._isPremium();
  }

  create() {
    return this.new();
  }

  show(){
    return true;
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