const express = require("express");
const { validate } = require("express-validation");
const multer = require("multer");
const {
  userLogin,
  userRegister,
} = require("../../controllers/userControllers/userControllers");
const {
  loginValidator,
  registerValidator,
} = require("../../middlewares/validators/userValidators");

const upload = multer({ dest: "uploads/", limits: { fileSize: 1331133 } });

const router = express.Router();

router.post("/login", validate(loginValidator), userLogin);
router.post(
  "/register",
  upload.single("avatar"),
  validate(registerValidator),
  userRegister
);

module.exports = router;
