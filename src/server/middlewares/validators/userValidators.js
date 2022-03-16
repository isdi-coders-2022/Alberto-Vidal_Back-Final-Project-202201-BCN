const { Joi } = require("express-validation");

const loginValidator = {
  body: Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required(),
  }),
};

const registerValidator = {
  body: Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required(),
    name: Joi.string().required(),
    avatar: Joi.string().required(),
  }),
};

module.exports = { loginValidator, registerValidator };
