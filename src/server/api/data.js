"use strict";
const router = require("express").Router();

const firebase = require("firebase/app");
const db = require("../../db/index");

router.post("/data", async (req, res, next) => {
  try {
    console.log("req.body ", req.body);
    const { id } = req.body;
    const { projectName } = req.body; // package.json name
    const { type } = req.body; // keystrokes or minutes
    const { data } = req.body; // object containing timestamp as a key and keystrokes or minutes value
    await db.ref(`users/${id}/${projectName}/${type}`).set({ data });
    res.status(201).send("created successfully");
  } catch (err) {
    console.error(err);
  }
});

module.exports = router;
