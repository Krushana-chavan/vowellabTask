// getflavourNames.service.js
const ProductsModel = require("../products.model");

const getAllFlavourNames = async () => {
  try {

    const filterQuery = {
      active: true
    };


    const projectStage = {

    };

    const aggregateQuery = [
      {
        $match:filterQuery
      },
      {
        $group: {
          _id: "$flavour",
        }
      },
      {
        $project: {
          _id: 0,
          flavour: "$_id",
        }
      },
     {
        $sort: {
          flavour: 1, // -1 for descending order
        },
      },

    ];
    const flavourNames = await ProductsModel.aggregate(aggregateQuery);
    console.log(flavourNames);
    return {
      status: true,
      code: 200,
      data: flavourNames,
    };
  } catch (error) {
    console.error("Error while getting flavour names:", error);
    return {
      status: false,
      code: 500,
      msg: error.message,
    };
  }
};

module.exports = getAllFlavourNames;
