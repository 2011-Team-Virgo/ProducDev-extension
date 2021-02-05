
const dbConfig = require("./dbConfig");
import firebase from "firebase/app";
import "firebase/database";

firebase.initializeApp(dbConfig);
const db = firebase.database();

export default db;
