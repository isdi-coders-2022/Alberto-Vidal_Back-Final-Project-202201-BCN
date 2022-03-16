require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../../../database/models/User");

const userLogin = async (req, res, next) => {
  const invalidCredentialsError = {
    message: "incorrect username or password",
    status: 409,
  };

  const { username: requestedUsername, password } = req.body;
  try {
    const {
      password: hash,
      id,
      name,
      username,
    } = await User.findOne({ username: requestedUsername });
    const isCorrectPassword = await bcrypt.compare(password, hash);
    if (!isCorrectPassword) {
      throw new Error();
    }

    const token = jwt.sign({ name, username, id }, process.env.JWT_SECRET);
    res.json({ token });
  } catch (error) {
    error.message = invalidCredentialsError.message;
    error.status = invalidCredentialsError.status;
    next(error);
  }
};

const userRegister = async (req, res, next) => {
  const user = req.body;
  try {
    await User.create(user);

    res.status(201).json({ created: user.username });
  } catch (error) {
    error.message = "username taken";
    error.status = 409;
    next(error);
  }
};

module.exports = { userLogin, userRegister };
