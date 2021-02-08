const express = require("express");
const router = express.Router();

router.use("/", require("./data"));

module.exports = router;
