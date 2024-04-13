const httpStatus = require('http-status');
const catchAsync = require("../../../utils/catchAsync");
const pick = require('../../../utils/pick');
const { sendResponse } = require("../../../utils/responseHandler");
const productsServices = require("../services");
const updateProduct = catchAsync(async (req, res) => {
    const { id } = await pick(req.params, ['id'])
    const {
        handleId,
        fieldType,
        name,
        description,
        productImageUrl,
        visible,
        price,
        discountMode,
        discountValue,
        inventory,
        weight,
        cost,
        features,
        flavor,
        discountByRupees,
        originalPrice,
        discountPercentage,
        brand } = await pick(req.body,
            [
                "handleId",
                "fieldType",
                "name",
                "description",
                "productImageUrl",
                "visible",
                "price",
                "discountMode",
                "discountValue",
                "inventory",
                "weight",
                "cost",
                "features",
                "flavor",
                "discountByRupees",
                "originalPrice",
                "discountPercentage",
                "brand"]);
    const insertResult = await productsServices.updateProduct(id, {
        handleId,
        fieldType,
        name,
        description,
        productImageUrl,
        visible,
        price,
        discountMode,
        discountValue,
        inventory,
        weight,
        cost,
        features,
        flavor,
        discountByRupees,
        originalPrice,
        discountPercentage,
        brand,
    });
    if (insertResult.status) {
        sendResponse(res, httpStatus.OK, insertResult.data, null);
    } else {
        if (insertResult.code == 400) {
            sendResponse(res, httpStatus.BAD_REQUEST, null, insertResult.data);
        }
        else if (insertResult.code == 500) {
            sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, null, insertResult.data);
        }
        else {
            sendResponse(res, httpStatus.BAD_REQUEST, null, insertResult.data);
        }
    }
});

module.exports = updateProduct;