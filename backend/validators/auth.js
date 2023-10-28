const Joi = require("joi");

const userRegisterSchema = Joi.object({
  name: Joi.string().required().messages({
    "string.base": "Name must be a string",
    "any.required": "Name is required",
  }),
  email: Joi.string().email().required().messages({
    "string.base": "Email must be a string",
    "string.email": "Please enter a valid email address",
    "any.required": "Email is required",
  }),
  password: Joi.string().min(6).required().messages({
    "string.base": "Password must be a string",
    "string.empty": "Password cannot be empty",
    "string.min": "Password must be at least {#limit} characters long",
    "any.required": "Password is required",
  }),
  pic: Joi.string(),
});

const userLoginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.base": "Email must be a string",
    "string.email": "Please enter a valid email address",
    "any.required": "Email is required",
  }),
  password: Joi.string().min(6).required().messages({
    "string.base": "Password must be a string",
    "string.empty": "Password cannot be empty",
    "string.min": "Password must be at least {#limit} characters long",
    "any.required": "Password is required",
  }),
});

module.exports = { userRegisterSchema, userLoginSchema };
