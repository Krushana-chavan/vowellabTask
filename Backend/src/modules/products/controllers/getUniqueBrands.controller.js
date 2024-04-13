const httpStatus = require('http-status');
const { sendResponse } = require('../../../utils/responseHandler');
const productServices = require('../services')

const getUniqueBrands = async (req, res) => {
	try {
		const result = await productServices.getUniqueBrands();
		if (result.status) {
			sendResponse(res, httpStatus.OK, result?.data, null);
		} else {
			sendResponse(res,
				result?.code === 500 ? httpStatus.INTERNAL_SERVER_ERROR
					: httpStatus.BAD_REQUEST, null, result?.msg
			);
		}
	} catch (error) {
		console.error("Error while getting unique brand names:", error);
		sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, null, error.message);
	}
};
module.exports = getUniqueBrands;
