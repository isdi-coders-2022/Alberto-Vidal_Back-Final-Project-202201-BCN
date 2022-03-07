require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const raiseServer = require("./server");
const { notFound, serverError } = require("./server/middlewares/errors");

const app = express();
const port = process.env.PORT || 5555;

(async () => {
  await raiseServer(app, port);
})();
app.use(morgan("dev"));
app.use(notFound);
app.use(serverError);
