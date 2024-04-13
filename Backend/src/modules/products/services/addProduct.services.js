
const productModel = require('../products.model');


/**
 * Create a Series
 * @param {Object} collectionData
 * @returns {Promise<Series>}
 */
const addProduct = async (productData) => {

    try {
        const addResult = await productModel.create({ ...productData });
        if (addResult) {
            return { data: addResult, status: true, code: 200 };
        }
        else {
            return { data: "Can not add product", status: false, code: 400 };
        }


    } catch (error) {
        return { data: error.message, status: false, code: 500 };
    }
};

module.exports = addProduct
