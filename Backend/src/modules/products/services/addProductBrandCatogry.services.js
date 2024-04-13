const mongoose = require('mongoose');
const ProductModel = require('../products.model');
const Product = require('../products.model');

const addProductInBrandCatogry = async (id, brandName) => {
    console.log(id, brandName)
    try {
        let filterQuery = { active: true, _id: mongoose.Types.ObjectId(id) }
        const product = await Product.findOne(filterQuery)
        if (product) {
            if (brandName == "") {
                let prevBrand = product?.prevBrand;
                let updateRes = await Product.findOneAndUpdate(filterQuery, { $set: { prevBrand: prevBrand, brand: prevBrand }, })
                return { data: updateRes, status: true, code: 200 };

            } else {
                let prevBrand = product?.brand;
                let updateRes = await Product.findOneAndUpdate(filterQuery, { $set: { prevBrand: prevBrand, brand: brandName }, })
                return { data: updateRes, status: true, code: 200 };

            }
        }
        else {
            return { data: "Product Not Found", status: false, code: 400 };
        }
    } catch (error) {
        return { data: error.message, status: false, code: 500 };
    }
};

module.exports = addProductInBrandCatogry
