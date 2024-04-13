
const OrderModel = require('../order.model');
const CartModel = require('../../cart/cart.model');
const ProductModel = require('../../products/products.model');
const AddressModel = require('../../addresses/addresses.model');
const mongoose = require("mongoose");
const moment = require("moment")


const addOrder = async (orderData) => {
	try {
		/* check for inventory available and return */
		for (let i = 0; i < orderData?.productDetail.length; i++) {
			
			let currentProduct = orderData?.productDetail[i];
          

			let productRes = await ProductModel.findOne({ _id: mongoose.Types.ObjectId(currentProduct?.productId), active: true })
            if(currentProduct.hasOwnProperty("subProduct")){
				
				for (let j = 0; j < currentProduct?.subProduct.length; j++) {
					let productRes2 = await ProductModel.findOne({ _id: mongoose.Types.ObjectId(currentProduct?.subProduct[j]?.productId), active: true })
					
					if (productRes2?.inventory == '0') {
						return { msg: `${productRes2?.name} is out of stock, please remove this item from your cart.`, status: false, code: 400 };
					} else if (Number(productRes2?.inventory) < currentProduct?.subProduct[j]?.quantity) {
						return { msg: `Item name ${productRes2?.name} has ${productRes2?.inventory} items left in stock, please update your cart.`, status: false, code: 400 };
					}
				}

			}else{
			if (productRes?.inventory == '0') {
				return { msg: `${productRes?.name} is out of stock, please remove this item from your cart.`, status: false, code: 400 };
			} else if (Number(productRes?.inventory) < currentProduct?.quantity) {
				return { msg: `Item name ${productRes?.name} has ${productRes?.inventory} items left in stock, please update your cart.`, status: false, code: 400 };
			}
		}
		}

		/* deduct inventory */
		for (let i = 0; i < orderData?.productDetail.length; i++) {
			let currentProduct = orderData?.productDetail[i];
			let productRes = await ProductModel.findOne({ _id: mongoose.Types.ObjectId(currentProduct?.productId), active: true })
			if (productRes && productRes?.inventory != "0") {
				if (productRes?.inventory != "InStock" && Number(productRes?.inventory) >= currentProduct?.quantity) {
				currentProduct.productDetailsObj = productRes;
				}
			}
		}

		const addResult = await OrderModel.create({ ...orderData });
		if (addResult) {
			return { data: addResult, status: true, code: 200 };
		} else {
			return { msg: "Something went wrong, please try again", status: false, code: 400 };
		}
	} catch (error) {
		console.log("error--------------",error)
		return { status: false, code: 500, msg: error.message }
	}
};

module.exports = addOrder