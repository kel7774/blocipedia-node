const collaborators = require("../db/models").Collaborator;

module.exports = class ApplicationPolicy {

  constructor(user, record) {
    this.user = user;
    this.record = record;
    this.collaborators = collaborators;
  }

  _isOwner() {
    return this.record && (this.record.userId == this.user.id);
  }

  _isAdmin() {
    return this.user && this.user.role == "admin";
  }

  _isPremium() {
      return this.user && this.user.role == "premium";
  }

  _isCollaborator(){
    return this.collaborators.userId == this.user.userId && this.collaborators.wikiId == this.user.wikiId;
  }

  new() {
    return this.user != null;
  }

  create() {
    return this.new();
  }

  show() {
    return true;
  }

  edit() {
    return this.new() && (this._isOwner() || this._isAdmin());
  }

  update() {
    return this.edit();
  }

  destroy() {
    return this.update();
  }
}