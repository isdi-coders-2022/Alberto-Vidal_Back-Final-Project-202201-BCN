const express = require("express");
const { default: helmet } = require("helmet");
const morgan = require("morgan");
const cors = require("cors");
const { notFound, serverError } = require("./middlewares/errors");
const projectsRouter = require("./routers/projectsRouter/projectsRouter");
const userRouter = require("./routers/userRouter./userRouter");

const app = express();

app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());

app.use("/projects", projectsRouter);
app.use("/user", userRouter);

app.use(notFound);
app.use(serverError);

module.exports = app;
