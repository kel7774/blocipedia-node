const express = require("express");
const router = express.Router();
const collaboratorController = require("../../src/controllers/collaboratorController");


router.get("/users/:userId/collaborations", collaboratorController.show);
router.post("/wikis/:wikiId/collaborators/create", collaboratorController.create);
router.post("/wikis/:wikiId/collaborators/destroy", collaboratorController.destroy);

module.exports = router;