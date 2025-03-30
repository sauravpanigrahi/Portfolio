const joi= require('joi');
module.exports.contactSchema= joi.object({
    contact: joi.object({
        name:joi.string().required(),
        email:joi.string().email().required(),
        phone:joi.string().required(),
        message:joi.string().required()
    }).required()
})
