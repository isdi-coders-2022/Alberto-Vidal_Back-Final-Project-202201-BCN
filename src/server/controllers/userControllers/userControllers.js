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

    const token = jwt.sign({ name, username, id }, process.env.SECRET);
    res.json({ token });
  } catch (error) {
    error.message = invalidCredentialsError.message;
    error.status = invalidCredentialsError.status;
    next(error);
  }
};

module.exports = { userLogin };
