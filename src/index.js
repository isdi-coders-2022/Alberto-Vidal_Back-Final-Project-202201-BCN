require("dotenv").config();
const express = require("express");
const raiseServer = require("./server");

const app = express();
const port = process.env.PORT || 5555;

(async () => {
  await raiseServer(app, port);
})();

app.use((req, res) => {
  res.json({ hello: "world" });
});
