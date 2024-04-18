const ProductsModel = require("../products.model");

const admingetAllProducts = async (page, limit, filter, sort) => {

    try {
        console.log("services",filter);
        const length = limit && parseInt(limit, 10) > 0 ? parseInt(limit, 10) : 10;
        const start = page && parseInt(page, 10) > 0 ? parseInt(page, 10) : 1;
        const skip = (start - 1) * length;
        let filterQuery = {
           active:true
        };


        if (filter && filter.search !== undefined && filter.search !== "") {
            var searchRegex = new RegExp(`.*${filter.search}.*`, "i")
            filterQuery.$or = [
                { name: { $regex: searchRegex } },
            ]
        }

        if (filter && filter.brand !== undefined && filter.brand !== "") {

            filterQuery.brand = filter.brand;
        }
        // if (filter && filter.sold !== undefined) {

        // 	if (filter.sold === "false") { filterQuery.sold = filter.sold }
        // }

        if (filter?.isFeatured) {
            filterQuery.isFeatured = filter.isFeatured;
        }

        let sortQuery = { _id: -1 };

        for (let key in sort) {

            if (sort.hasOwnProperty(key)) {

                let value = sort[key];
                let numericValue = Number(value);
                if (!isNaN(numericValue)) {
                    sort[key] = numericValue;

                }
            }
        }
        if (sort != null) {
            sortQuery = sort;
        }

        if (filter?.name) {
            let a = {
                $or: [
                    { name: { $regex: filter.name, $options: "i" } },
                    // { "user { $regex: filter.name, $options: "i" } },
                    // { email: { $regex: filter.firstName, $options: "i" } }
                ]
            }
            var searchRegex = new RegExp(`.*${filter.name}.*`, "i")
            filterQuery = { ...filterQuery, ...a }
        }



        console.log(sortQuery);
        console.log("filterQuery", filterQuery);
        const ProductList = await ProductsModel.find(filterQuery)
            .skip(skip)
            .limit(length)
            .sort(sortQuery)
            .lean();
        const totalResults = await ProductsModel.countDocuments(filterQuery);
        console.log(totalResults);
        const totalPages = Math.ceil(totalResults / length);
        return {
            data: ProductList,
            totalPages,
            totalResults,
            page: start,
            limit: length,
            status: true,
            code: 200,
        };
    } catch (error) {
        console.log("Error while getting product list :", error)
        return { status: false, code: 500, msg: error }
    }
}

module.exports = admingetAllProducts