require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const fs = require("fs/promises");
const path = require("path");
const { ref, uploadBytes, getDownloadURL } = require("firebase/storage");
const User = require("../../../database/models/User");
const storage = require("../../firebase");

const resourcesFolder = "uploads";
const firebaseDestinationFolder = "avatars";

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
      avatar,
    } = await User.findOne({ username: requestedUsername });
    const isCorrectPassword = await bcrypt.compare(password, hash);
    if (!isCorrectPassword) {
      throw new Error();
    }

    const token = jwt.sign(
      { name, username, id, avatar },
      process.env.JWT_SECRET
    );
    res.json({ token });
  } catch (error) {
    error.message = invalidCredentialsError.message;
    error.status = invalidCredentialsError.status;
    next(error);
  }
};

const userRegister = async (req, res, next) => {
  try {
    const avatarName = req.file.originalname;
    const avatarPath = path.join(resourcesFolder, avatarName);
    await fs.rename(path.join(resourcesFolder, req.file.filename), avatarPath);

    const avatar = await fs.readFile(avatarPath);

    const avatarReference = ref(
      storage,
      `${firebaseDestinationFolder}/${avatarName}`
    );
    await uploadBytes(avatarReference, avatar);
    const avatarUrl = await getDownloadURL(avatarReference);

    const user = { ...req.body, avatar: avatarUrl };
    const userWithHashedPassword = {
      ...user,
      password: await bcrypt.hash(user.password, 10),
    };
    await User.create(userWithHashedPassword);

    res.status(201).json({ created: user.username });
  } catch (error) {
    error.message = "username taken";
    error.status = 409;
    next(error);
  }
};

module.exports = { userLogin, userRegister };
