const ADDRESS_MODEL = require("../addresses.model");
const mongoose = require('mongoose');

const addAddress = async (addressData) => {
    console.log("addressData",addressData);
    try {
        if (addressData) {
            const addResult = await ADDRESS_MODEL.create({ ...addressData });
        if (addResult) {
            return { data: addResult, status: true, code: 200 };
        }
        else {
            return { data: "Can not Address", status: false, code: 400 };
        }
            
        }
    } catch (error) {
        console.log("Error while getting data:", error);
        return { status: false, code: 500, msg: error };
    }
}

module.exports = addAddress;
