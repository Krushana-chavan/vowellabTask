const httpStatus = require('http-status');
const catchAsync = require("../../../utils/catchAsync");
const pick = require('../../../utils/pick');
const { sendResponse } = require("../../../utils/responseHandler");
const orderServices = require("../services");
const successOrder = catchAsync(async (req, res) => {
	const { id } = await pick(req.params, ['id'])
	const insertResult = await orderServices.successOrder( id );

	if (insertResult.code == 200) {
		sendResponse(res, httpStatus.OK, insertResult.data, null);
	} else if (insertResult.code == 400) {
		sendResponse(res, httpStatus.BadRequest,null, insertResult.data)
	}else if( insertResult.code == 403){
		sendResponse(res,403,null,insertResult.data)
	}
});

module.exports = successOrder;