const express = require("express");
const { default: helmet } = require("helmet");
const morgan = require("morgan");
const cors = require("cors");
const { notFound, serverError } = require("./middlewares/errors");
const projectsRouter = require("./routers/projectsRouter/projectsRouter");
const userRouter = require("./routers/userRouter./userRouter");
const auth = require("./middlewares/auth/auth");

const app = express();

app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());

app.use("/user", userRouter);
app.use("/projects", auth, projectsRouter);

app.use(notFound);
app.use(serverError);

module.exports = app;
