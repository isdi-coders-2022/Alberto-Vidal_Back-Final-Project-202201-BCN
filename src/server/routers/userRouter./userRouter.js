const express = require("express");
const { validate } = require("express-validation");
const {
  userLogin,
} = require("../../controllers/userControllers/userControllers");
const {
  loginValidator,
} = require("../../middlewares/validators/userValidators");

const router = express.Router();

router.post("/login", validate(loginValidator), userLogin);

module.exports = router;
