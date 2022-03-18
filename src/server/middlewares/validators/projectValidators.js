const { Joi } = require("express-validation");

const createProjectValidator = {
  body: Joi.object({
    author: Joi.string().hex().length(24).required(),
    preview: Joi.string().required(),
    production: Joi.string(),
    repo: Joi.string().required(),
  }),
};

const editProjectValidator = {
  body: Joi.object({
    author: Joi.object({
      username: Joi.string().required(),
      id: Joi.string().required(),
      avatar: Joi.string().required(),
    }).required(),
    preview: Joi.string().required(),
    production: Joi.string(),
    repo: Joi.string().required(),
    id: Joi.string().required(),
    likes: Joi.number().required(),
  }),
};

module.exports = { createProjectValidator, editProjectValidator };
