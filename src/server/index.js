const express = require("express");
const morgan = require("morgan");
const { notFound, serverError } = require("./middlewares/errors");
const projectsRouter = require("./routers/projectsRouter");

const app = express();

app.use(morgan("dev"));

app.use("/projects", projectsRouter);

app.use(notFound);
app.use(serverError);

module.exports = app;
