"use strict";

const firebase = require("firebase/app");
const database = require("../db/index");

const addData = async (req, res, next) => {
  try {
    const data = req.body;
    const user = await database.ref("users").set(data);
    res.status(201).json(data);
  } catch (err) {
    console.error(err);
  }
};

module.exports = addData;
