const firebase = require('firebase/app');
const auth = require('firebase/auth');
const db = require('firebase/database');

const dbConfig = {
  apiKey: "AIzaSyAe9TREuTK9UgMRKcibsnRPZnH7VRIQqZE'",
  authDomain: 'producdev-1277b.firebaseapp.com',
  databaseURL: 'https://producdev-1277b-default-rtdb.firebaseio.com/',
  storageBucket: 'producdev-1277b.appspot.com',
};

firebase.initializeApp(dbConfig);

// Get a reference to the database service
const database = firebase.database();
