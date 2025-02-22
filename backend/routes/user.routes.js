const express = require("express");
const { createUser, getUserData } = require("../controller/user.controller");

const router = express.Router();

//Store user data
router.post("/create", createUser);

//Get user data
router.get("/:auth0", getUserData);

module.exports = router;