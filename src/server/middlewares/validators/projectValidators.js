const { Joi } = require("express-validation");

const createProjectValidator = {
  body: Joi.object({
    author: Joi.string().hex().length(24).required(),
    preview: Joi.string().required(),
    production: Joi.string(),
    repo: Joi.string().required(),
  }),
};

module.exports = { createProjectValidator };
