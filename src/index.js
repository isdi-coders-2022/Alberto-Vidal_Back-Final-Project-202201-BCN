require("dotenv").config();
const debug = require("debug")("PS_api:root:");
const express = require("express");
const chalk = require("chalk");

const app = express();
const port = process.env.PORT || 5555;

const server = app.listen(port, () => {
  debug(chalk.bgGreen.black(`server listening at http://localhost:${port}`));
});

server.on("error", () => {
  debug(chalk.red("error raising server"));
});

app.use((req, res) => {
  res.json({ hello: "world" });
});
