"use strict";

const firebase = require("firebase/app");
const database = require("../db/index");

const addData = async (req, res, next) => {
  try {
    console.log(req.body);
    const { id } = req.body;
    const { projectName } = req.body; // package.json name
    const { type } = req.body; // keystrokes or minutes
    const { data } = req.body; // object containing timestamp as a key and keystrokes or minutes value
    const user = await database
      .ref(`users/${uid}/${projectName}/${type}`)
      .set({ data });
    res.status(201).json(user);
  } catch (err) {
    console.error(err);
  }
};

module.exports = addData;
