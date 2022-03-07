require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const connectDB = require("./database");
const raiseServer = require("./server");
const { notFound, serverError } = require("./server/middlewares/errors");

const app = express();
const port = process.env.PORT || 5555;
const uri = process.env.URI;

(async () => {
  await connectDB(uri);
  await raiseServer(app, port);
})();
app.use(morgan("dev"));
app.use(notFound);
app.use(serverError);
