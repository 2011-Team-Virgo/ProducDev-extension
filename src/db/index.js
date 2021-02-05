const firebase = require("firebase/app");
const dbConfig = require("./dbConfig");
const db = require("firebase/database");

console.log(firebase)
firebase.initializeApp(dbConfig);
const database = firebase.database();

module.exports = database;
