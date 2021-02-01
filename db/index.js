const firebase = require('firebase/app');
const auth = require('firebase/auth');
const db = require('firebase/database');
const dbConfig = require('./dbConfig');

firebase.initializeApp(dbConfig);

// Get a reference to the database service
const database = firebase.database();
