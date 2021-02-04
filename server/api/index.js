const express = require("express");
const addData = require("./data");
const router = express.Router();

router.post("/:uid", addData);

module.exports = router;
