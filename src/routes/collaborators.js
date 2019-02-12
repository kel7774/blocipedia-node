const express = require("express");
const router = express.Router();
const collaboratorController = require("../../src/controllers/collaboratorController");

router.get("/wikis/:id/collaborators", collaboratorController.show);
router.get("/wikis/:id/collaborators/new", collaboratorController.newForm);
router.post("/wikis/:id/collaborators/create", collaboratorController.create);

module.exports = router;