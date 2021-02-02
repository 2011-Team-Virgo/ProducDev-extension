const express = require("express");
const addData = require("./users");
const router = express.Router();

router.post("/", addData);

module.exports = router;
