const httpStatus = require('http-status');
const catchAsync = require("../../../utils/catchAsync");
const pick = require('../../../utils/pick');
const { sendResponse } = require("../../../utils/responseHandler");
const orderServices = require("../services");
const { convertToJSON } = require('../../../utils/helper');

const admingetAllOrders = catchAsync(async (req, res) => {
    const { page, limit, filter, sort } = req.query;

    let filter_Json_data = filter ? JSON.parse(filter) : null;
    if(filter_Json_data){
    filter_Json_data.paymentType = 'pay360';}

    console.log("before call api----",filter_Json_data)
    let result = await orderServices.admingetAllOrders(page, limit, filter_Json_data, sort)
    if (result.status) {
        sendResponse(res, httpStatus.OK,
            {
                data: result?.data,
                totalResults: result?.totalResults,
                totalPages: result?.totalPages,
                page: result?.page,
                limit: result?.limit
            },
            null);
    } else {
        if (result?.code === 400) {
            sendResponse(res, httpStatus.BAD_REQUEST, null, result?.data);
        } else if (result?.code === 500) {
            sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, null, result?.data);
        } else {
            sendResponse(res, httpStatus.BAD_REQUEST, null, result);
        }
    }

});

module.exports = admingetAllOrders;