const express = require("express");

const { getAsset, putAsset } = require("../controllers/assetController");

const router = express.Router();

router.route("/get").post(getAsset);
router.route("/put").post(putAsset);

module.exports = router;
