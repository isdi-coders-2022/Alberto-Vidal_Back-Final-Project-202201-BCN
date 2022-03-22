const { Joi } = require("express-validation");

const createProjectValidator = {
  body: Joi.object({
    author: Joi.string().hex().length(24).required(),
    production: Joi.string(),
    repo: Joi.string().required(),
  }),
};

const editProjectValidator = {
  body: Joi.object({
    author: Joi.string().required(),
    production: Joi.string(),
    repo: Joi.string().required(),
    id: Joi.string().hex().length(24).required(),
    likes: Joi.number().required(),
  }),
};

module.exports = { createProjectValidator, editProjectValidator };
