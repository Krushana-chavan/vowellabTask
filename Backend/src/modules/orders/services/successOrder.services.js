const mongoose = require('mongoose');
const orderModel = require('../order.model');
const productModel = require("../../products/products.model");
const deleteMyCart = require('../../cart/services/deleteMyCart.service');

const successOrder = async (productId) => {
    try {
        const filterQuery = { active: true, _id: mongoose.Types.ObjectId(productId) };
        const findSucceessOrder = await orderModel.findOne(filterQuery);
        if(findSucceessOrder?.paymentStatus == "paid"){
            return {data:"Order already paid",status:false,code:403}
        };
    
        const updateResult = await orderModel.findOneAndUpdate(filterQuery, {paymentStatus:'paid',orderStatus:"fulfilled" }, { new: true });
        let ProductDetails = updateResult.productDetail;
        for(let i = 0 ; i< ProductDetails.length;i++){
            const findProduct = await productModel.findOne({_id: mongoose.Types.ObjectId(ProductDetails[i].productId)});
            const updateProduct = await productModel.findOneAndUpdate({_id: mongoose.Types.ObjectId(ProductDetails[i].productId)},{inventory:findProduct?.inventory - ProductDetails[i].quantity})
        }
        if (updateResult) {
            await deleteMyCart(updateResult?.userId)
            return { data: updateResult, status: true, code: 200 }
        } else {
            return { data: "Order Not Found", status: false, code: 400 }
        }
    } catch (error) {
        console.log(error.message)
        return { data: error.message, status: false, code: 500 }
    }
};

module.exports = successOrder
