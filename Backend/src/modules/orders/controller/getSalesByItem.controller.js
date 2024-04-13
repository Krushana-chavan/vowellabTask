const httpStatus = require('http-status');
const catchAsync = require("../../../utils/catchAsync");
const pick = require('../../../utils/pick');
const { sendResponse } = require("../../../utils/responseHandler");
const orderServices = require("../services");
const { convertToJSON } = require('../../../utils/helper');

const getSalesByItem = catchAsync(async (req, res) => {
    const { productId } = await pick(req.params, ['productId'])

	let { startDate , endDate  } = await pick(req.query, ['startDate', 'endDate'])
     let filter ={}

	if (startDate && endDate) {
		filter['createdAt'] = {
			'$gte': new Date(new Date(startDate).setHours(0,0, 0,0)),
			'$lte': new Date(new Date(endDate).setHours(23, 59, 59))
		}
	}
   
    let result = await orderServices.getSalesByItem(filter,productId)
	
	sendResponse(res, httpStatus.OK, result?.data, null);
	if (result.status) {
	} else {
		sendResponse(res, result?.code === 400 ? httpStatus.BAD_REQUEST
			: result?.code === 500 ? httpStatus.INTERNAL_SERVER_ERROR
				: httpStatus.BAD_REQUEST,
			null, result?.msg);
	} 
});

module.exports = getSalesByItem;