const express = require("express");
const router = express.Router();
const validation = require("./validation");
const userController = require("../controllers/userController");

router.post("/users/signup", userController.signUp);

module.exports = router;