const express = require("express");
const { getCompanies, creatcompanes } = require("../controller/companies");
const { protect, athtorize } = require("../middleware/auth");
const router = express.Router();
router.route("/").get(protect, getCompanies);
router.route("/create").post(protect, athtorize("admin"), creatcompanes);
module.exports = router;