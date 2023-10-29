const express = require("express");

const { getAsset } = require("../controllers/assetController");

const router = express.Router();

router.route("/get").post(getAsset);
// router.route("/put").post(getAsset);

module.exports = router;
