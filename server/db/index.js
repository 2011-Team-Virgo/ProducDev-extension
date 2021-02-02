const firebase = require("firebase/app");
const dbConfig = require("./dbConfig");
const db = require("firebase/database");

firebase.initializeApp(dbConfig);
const database = firebase.database();

module.exports = database;
