const mongoose = require('mongoose');
const productModel = require('../products.model');

const productIds = [];

/**
 * Create a Series
 * @param {Object} collectionData
 * @returns {Promise<{ category: { brandName: string, productIds: string[] } }>}
 */
const addCategory = async (ids, brand) => {
    try {
        let product
        let filterQuery;
        let brandNamearray = []
        for (const id of ids) {
            filterQuery = { active: true, _id: mongoose.Types.ObjectId(id) }
            product = await productModel.find(filterQuery);
            let previousBrand = product[0]?.brand

            if (previousBrand) {
                let update1 = await productModel.findByIdAndUpdate(filterQuery, { $set: { prevBrand: previousBrand } })
               
            }else{
                let update1 = await productModel.findByIdAndUpdate(filterQuery, { $set: { prevBrand: brand } })
          
            }

            let update2 = await productModel.findByIdAndUpdate(filterQuery, { $set: { brand: brand } })

            brandNamearray.push(update2._id)

        }

        if (product) {


            return { data: brandNamearray, status: true, code: 200 };
        }
    } catch (error) {
        console.log("error", error);
        return { category: null, error: error.message };
    }
};

module.exports = addCategory;
