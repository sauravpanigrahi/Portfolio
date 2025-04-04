const Joi = require('joi');

module.exports.contactSchema = Joi.object({
  contact: Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    phone: Joi.string().required(),
    message: Joi.string().required()
  }).required()
});
