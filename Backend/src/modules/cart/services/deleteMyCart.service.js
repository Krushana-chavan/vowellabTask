const CART_MODEL = require("../cart.model");

const mongoose = require('mongoose');
const deleteMyCart = async (userId) => {
 
  try {
    const filterQuery = {
      userId: mongoose.Types.ObjectId(userId),
    };

  

    const result = await CART_MODEL.findOneAndRemove(filterQuery);
    
    if (result) {
      return {
          data: result,
          totalItems:result.length,
          status: true,
          code: 200
      };
  }
  else {
      return { data: "Product not found", status: false, code: 400 };
  }
  } catch (error) {

    return { status: false, code: 500, msg: error };
  }
}

module.exports = deleteMyCart;
