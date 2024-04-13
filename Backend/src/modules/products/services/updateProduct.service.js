const mongoose = require('mongoose');
const ProductModel = require('../products.model');
const updateSeries = async (productId, reqBody) => {
  try {
    const filterQuery = { active: true, _id: mongoose.Types.ObjectId(productId) };
    const updateResult = await ProductModel.findOneAndUpdate(filterQuery, {
      name: reqBody.name,
      inventory: reqBody.inventory,
      description: reqBody.description,
      price: reqBody.price,
      features: reqBody.features,
      productImageUrl: reqBody.productImageUrl,
      cost: reqBody.cost,
      flavor: reqBody?.flavor,
      weight: reqBody?.weight,
      brand: reqBody?.brand,
      originalPrice:reqBody?.originalPrice,
      discountByRupees: reqBody?.discountByRupees,
      discountPercentage: reqBody?.discountPercentage,
    }, { new: true });



    if (updateResult) {
      return { data: updateResult, status: true, code: 200 }
    } else {
      return { data: "Product Not Found", status: false, code: 400 }
    }
  } catch (error) {
    return { data: error.message, status: false, code: 500 }
  }
};

module.exports = updateSeries
