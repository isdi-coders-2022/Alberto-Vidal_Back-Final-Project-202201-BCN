const express = require("express");
const { validate } = require("express-validation");
const {
  userLogin,
  userRegister,
} = require("../../controllers/userControllers/userControllers");
const {
  loginValidator,
  registerValidator,
} = require("../../middlewares/validators/userValidators");

const router = express.Router();

router.post("/login", validate(loginValidator), userLogin);
router.post("/register", validate(registerValidator), userRegister);

module.exports = router;
