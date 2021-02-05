const dbConfig = require("./dbConfig");
const firebase = require("firebase/app");
const database = require("firebase/database");

firebase.initializeApp(dbConfig);
const db = firebase.database();

module.exports = db;
