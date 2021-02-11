const { apiKey, authDomain, databaseURL, storageBucket } = require("./.env.js");

const dbConfig = {
  apiKey: apiKey,
  authDomain: authDomain,
  databaseURL: databaseURL,
  storageBucket: storageBucket,
};

module.exports = dbConfig;
