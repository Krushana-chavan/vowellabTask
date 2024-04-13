const ADDRESS_MODEL = require('../addresses.model');
const mongoose = require("mongoose");
const updateAddress = async (addressData,id) => {
    try {
        if (addressData) {
            const { userId, isDefault } = addressData;
            const  addressId = id
            const filterQuery ={_id: mongoose.Types.ObjectId(addressId), userId:mongoose.Types.ObjectId(userId)}
            console.log("addressData: " , addressData);
            if (isDefault) {
                await ADDRESS_MODEL.updateMany({ isDefault: true }, { $set: { isDefault: false } });
            }

            const updateResult = await ADDRESS_MODEL.findOneAndUpdate(
                filterQuery,
                { $set: { ...addressData } },
                { new: true }
            );

            if (updateResult) {
                return { data: updateResult, status: true, code: 200 };
            } else {
                return { data: "Address not found or update failed", status: false, code: 400 };
            }
        }
    } catch (error) {
        console.log("Error while updating address:", error);
        return { status: false, code: 500, msg: error };
    }
};

module.exports =  updateAddress ;
