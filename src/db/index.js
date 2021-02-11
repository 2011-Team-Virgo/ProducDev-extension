const dbConfig = require("./dbConfig");
const firebase = require("firebase/app");


console.log(firebase)
firebase.initializeApp(dbConfig);
const db = firebase.database();

export default db;
