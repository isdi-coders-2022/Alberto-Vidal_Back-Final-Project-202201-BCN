const { Joi } = require("express-validation");

const createProjectValidator = {
  body: Joi.object({
    author: Joi.string().hex().length(24).required(),
    preview: Joi.string().required(),
    links: Joi.object({
      production: Joi.string(),
      repo: Joi.string().required(),
    }),
  }),
};

module.exports = { createProjectValidator };
