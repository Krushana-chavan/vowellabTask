const httpStatus = require('http-status');
const catchAsync = require('../../../utils/catchAsync');
const { sendResponse } = require('../../../utils/responseHandler');
const Services = require('../services');
const pick = require('../../../utils/pick');

const updateAddressController = catchAsync(async (req, res) => {
    const userId = req?.user?.id
    const { id } = await pick(req.params, ["id"]);   
    
     const {firstName,lastName,phone,orderNotes,country,addressLine1,addressLine2,city,state,zip,isDefault} = await pick(req.body,["firstName","lastName","phone","orderNotes","country","addressLine1","addressLine2","city","state","zip","isDefault",]) ;

    const result = await Services.updateAddress({userId:userId,firstName,lastName,phone,orderNotes,country,addressLine1,addressLine2,city,state,zip,isDefault},id);

    console.log(result);
    if (result?.code === 200) {
        sendResponse(res, httpStatus.OK, {
            data: result?.data,
        }, null);
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

module.exports = updateAddressController;
