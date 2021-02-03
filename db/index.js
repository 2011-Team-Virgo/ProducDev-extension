const firebase = require("firebase/app");
const auth = require("firebase/auth");
const db = require("firebase/database");
const dbConfig = require("./dbConfig");

firebase.initializeApp(dbConfig);

// Get a reference to the database service
const database = firebase.database();

// firebase.auth().onAuthStateChange((user) => {
//   user ? console.log(user) : console.log("no user");
// });

const uid = "vQlG7vGTXFMDhwGZiRuJxQkf4jq2";

firebase
  .database()
  .ref("users/" + uid)
  .set({
    username: "Anthony",
    email: "anthonycorreia12@gmail.com",
    pic: "pic/url"
  });
