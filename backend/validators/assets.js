const Joi = require("joi");

const assetSchema = Joi.object({
  key: Joi.string().required(),
});

module.exports = {
  assetSchema,
};
