const express = require("express");
const app = express();
const PORT = process.env.PORT || 8080;

// body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", require("./api"));

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
