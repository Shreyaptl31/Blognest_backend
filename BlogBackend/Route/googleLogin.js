const express = require("express");
const router = express.Router();

const { googleLogin } = require("../Controller/UserController");

router.post("/googleLogin", googleLogin);

module.exports = router;