const httpStatus = require('http-status');
const catchAsync = require("../../../utils/catchAsync");
const pick = require('../../../utils/pick');
const { sendResponse } = require("../../../utils/responseHandler");
const orderServices = require("../services");
const successOrder = catchAsync(async (req, res) => {
	const { id } = await pick(req.params, ['id'])
	const insertResult = await orderServices.successOrder( id );

	if (insertResult.status) {
		sendResponse(res, httpStatus.OK, insertResult.data, null);
	} else {
		sendResponse(res,
			insertResult.code == 400 ? httpStatus.BAD_REQUEST
				: insertResult.code == 500 ? httpStatus.INTERNAL_SERVER_ERROR
					: httpStatus.BAD_REQUEST,
			null,
			insertResult.msg
		);
	}
});

module.exports = successOrder;