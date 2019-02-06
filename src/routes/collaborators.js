const express = require("express");
const router = express.Router();
const collaboratorController = require("../../src/controllers/collaboratorController");
const User = require("../db/models").User;

router.get("/wikis/:wikiId/collaborators", collaboratorController.show);
router.post("/wikis/:wikiId/collaborators/create", collaboratorController.create);
router.post("/wikis/:wikiId/collaborators/destroy", collaboratorController.destroy);

module.exports = router;