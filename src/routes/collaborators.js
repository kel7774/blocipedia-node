const express = require("express");
const router = express.Router();
const collaboratorController = require("../../src/controllers/collaboratorController");

router.post("/wikis/:id/collaborators/add", collaboratorController.add);
router.post("/wikis/:id/collaborators/remove", collaboratorController.remove);

module.exports = router;