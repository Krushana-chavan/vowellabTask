const mongoose = require('mongoose');
const CART_MODEL = require('../cart.model');

const removeCartservice = async (cartData) => {
    try {

        const existingCartItem = await CART_MODEL.findOne({
            productId: mongoose.Types.ObjectId(cartData.productId),
            userId: mongoose.Types.ObjectId(cartData.userId),
        });

        if (existingCartItem) {
            const response = await existingCartItem.remove();
            if (response) {
                return {
                    data: "Product removed from cart successfully!",
                    status: true,
                    code: 200
                };
            }else{
                return {data:'Error While Removing Data',status:false,code:400}
            }
        }
        else{
            return{data:'Product Not Found',status:false,code:401}
        }
    } catch (error) {
        throw new Error(`Failed to remove item from cart: ${error.message}`);
    }
}

module.exports = removeCartservice;
