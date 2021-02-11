const dbConfig = require("./dbConfig");
const firebase = require("firebase/app");

firebase.initializeApp(dbConfig);
const db = firebase.database();

export default db;
