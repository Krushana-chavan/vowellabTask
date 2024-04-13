const mongoose = require('mongoose');
const ProductModel = require('../products.model');

const getProductById = async (id) => {
   try {  
    let filterQuery = {active: true, _id : mongoose.Types.ObjectId(id)}
    const product = await ProductModel.findOne(filterQuery)
    if (product) {
        return { data: product, status:true,code:200 };
    }
    else{
        return { data: "Product Not Found", status:false,code:400 };
    }
    } catch (error) {
       return { data: error.message, status:false,code:500 };
   }
};

module.exports = getProductById
