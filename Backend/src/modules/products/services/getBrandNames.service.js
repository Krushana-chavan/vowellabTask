// getBrandNames.service.js
const ProductsModel = require("../products.model");

const getAllBrandNames = async () => {
  try {

    const filterQuery = {
      active: true
    };


    const projectStage = {

    };

    const aggregateQuery = [
      {
        $match: filterQuery,
      },
      {
        $group: {
          _id: "$brand",
          imageUrls: { $push: "$productImageUrl" }
        }
      },
      {
        $project: {
          _id: 0,
          brand: "$_id",
          imageUrls: 1
        }
      },

      // {
      //   $project: {
      //     productImageUrl: 1,
      //     brand: 1, // Include any other fields you want to project
      //   }
      // },

    ];
    const brandNames = await ProductsModel.aggregate(aggregateQuery);
    return {
      status: true,
      code: 200,
      data: brandNames,
    };
  } catch (error) {
    console.error("Error while getting brand names:", error);
    return {
      status: false,
      code: 500,
      msg: error.message,
    };
  }
};

module.exports = getAllBrandNames;
