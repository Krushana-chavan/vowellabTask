const Joi = require('joi');
const { objectId } = require('../auth/custom.validation');


const addOrder = {
    body: Joi.object().keys({
        productDetail: Joi.array().required(),
        paymentMode: Joi.string().required(),
        paymentStatus: Joi.string().required(),
        orderStatus: Joi.string(),
        paymentType:Joi.string().allow(""),
        shippingAdderess: Joi.object().required(),
        deliveryMethod: Joi.string().required(),
        amountToPay: Joi.number().required(),
        deliveryCharge: Joi.number().required(),
        transactionId:Joi.any(),
        paymentType:Joi.any().allow("")
      

    }),
};
const updateProduct = {
    body: Joi.object().keys({
        handleId: Joi.string().allow(""),
        fieldType: Joi.string().required(),
        name: Joi.string().required(),
        description: Joi.string().allow(""),
        productImageUrl: Joi.string().required(),
        collectionName: Joi.string().allow(),
        visible: Joi.boolean().allow(""),
        price: Joi.number().allow(""),
        discountMode: Joi.string().allow(''),
        discountValue: Joi.string().allow(''),
        inventory: Joi.string().allow(''),
        isFeatured: Joi.boolean().allow(""),
        weight: Joi.number().allow(""),
        cost: Joi.number().allow(""),
        brand: Joi.string().allow("")
    }),
};
const addTrackingNumber = {
    body: Joi.object().keys({
        trackingNumber: Joi.string().required(),
        ShippingCarrier: Joi.string().required(),
        isShippingMailchecked: Joi.boolean().allow(""),
        trackingURL: Joi.string().allow("")

    }),
};


module.exports = {
    addOrder,
    addTrackingNumber

};