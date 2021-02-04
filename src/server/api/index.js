const express = require("express");
const addData = require("./data");
const router = express.Router();

router.post("/", addData);

module.exports = router;
