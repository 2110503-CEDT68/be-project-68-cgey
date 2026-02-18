const express = require("express");
const { register, getUser } = require("../controller/auth");

const router = express.Router();
router.route("/user").get(getUser);
router.route("/register").post(register);
module.exports = router;
