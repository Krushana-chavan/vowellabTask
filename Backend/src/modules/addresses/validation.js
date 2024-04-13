const Joi = require('joi');


const addAddress = {
    body: Joi.object().keys({
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
        phone: Joi.string().required(),
        orderNotes: Joi.string().allow(""),
        country: Joi.string().required(),
        addressLine1: Joi.string().required(),
        addressLine2:Joi.string().allow(""),
        city: Joi.string().required(),
        state: Joi.string().required(),
        zip: Joi.string().required(),
        isDefault: Joi.boolean().allow(""),
        email: Joi.string().required(),
     
    }),
};

const updateAddress = {
    body: Joi.object().keys({
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
        phone: Joi.string().required(),
        orderNotes: Joi.string().allow(""),
        country: Joi.string().required(),
        addressLine1: Joi.string().required(),
        addressLine2:Joi.string().allow(""),
        city: Joi.string().required(),
        state: Joi.string().required(),
        zip: Joi.number().required(),
        email: Joi.string().required(),
        isDefault: Joi.boolean().allow(""),
     
    }),
};

module.exports = {
    addAddress,
    updateAddress,
};


