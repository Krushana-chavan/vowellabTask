const CART_MODEL = require("../cart.model");

const mongoose = require('mongoose');
const getMyCartByDevice = async (deviceId) => {
 
  try {
    const filterQuery = {
      deviceId: deviceId,
      userId: null,
      isActive:true
    };

    const customPipeline = [
      {
        $match: filterQuery,
      },

    //   {
    //     $lookup: {
    //       from: 'users',
    //       localField: 'userId',
    //       foreignField: '_id',
    //       as: 'userDetail',
    //     },
    //   },
    //   {
    //     $unwind: {
    //       path: '$userId',
    //       preserveNullAndEmptyArrays: true,
    //     },
    //   },
    //   {
    //     $project: {
    //       "userDetail.password": 0
    //     }
    //   },
      {
        $lookup: {
          from: "products",
          localField:"productId",
          foreignField:"_id",
          as:'productDetails'

        }
      },
      {
        $unwind:{
          path: "$product",
          preserveNullAndEmptyArrays: true,
        
        }

      },
      {
        $match: filterQuery,
      },
    ];

    const result = await CART_MODEL.aggregate(customPipeline);
    
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

module.exports = getMyCartByDevice;
