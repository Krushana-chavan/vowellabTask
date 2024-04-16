const CART_MODEL = require("../cart.model");
const ProductModel = require('../../products/products.model');
const mongoose = require('mongoose');

const addToCart = async (cartData) => {
	try {
		if (cartData) {

			
			const productObj = await ProductModel.findById({ _id: mongoose.Types.ObjectId(cartData.productId) });

			if (productObj == null) {
				return {
					status: false,
					code: 404,
					msg: 'This product not available now, please try after some time.',
				}
			}

			if (productObj?.inventory == "0") {
				return { status: false, code: 400, msg: `${productObj?.name} is out of stock now, please update your cart.` }
			}

			const existingCartItem = await CART_MODEL.findOne({ productId: mongoose.Types.ObjectId(cartData.productId), userId: mongoose.Types.ObjectId(cartData.userId) });

			if (existingCartItem) {
		
				if(cartData?.quantity>0){
				
					existingCartItem.quantity =parseInt(existingCartItem.quantity?existingCartItem.quantity:0) +parseInt(cartData?.quantity);
				
				
				}else{
					existingCartItem.quantity += 1;
					
				}
				await existingCartItem.save();
				return {
					data: "Product added to your cart successfully.",
					status: true,
					code: 200
				};
			} else {
				const addResult = await CART_MODEL.create({ ...cartData });
				if (addResult) {
					return {
						data: "Product added to your cart successfully.",
						status: true,
						code: 200
					};
				}
			}
		}
	} catch (error) {
		
		return { status: false, code: 500, msg: error };
	}
}

module.exports = addToCart;
