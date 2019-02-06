module.exports = class ApplicationPolicy {

     constructor(user, record, collaborators) {
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

     _isStandard(){
       return this.user && this.user.role == "standard";
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
       return this.new() &&
         this.record && (this._isStandard() || this._isAdmin() || this._isPremium());
     }
   
     update() {
       return this.edit();
     }
   
     destroy() {
       return this.update();
     }

     showCollaborators(){
       return this.edit();
     }
   }