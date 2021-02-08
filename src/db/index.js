import dbConfig from "./dbConfig";
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";


console.log(firebase)
firebase.initializeApp(dbConfig);
const db = firebase.database();

export default db;
