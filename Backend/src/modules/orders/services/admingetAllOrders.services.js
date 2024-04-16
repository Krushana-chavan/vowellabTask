const ProductsModel = require("./../order.model");

const admingetAllOrders = async (page, limit, filter, sort) => {

    try {
        const length = limit && parseInt(limit, 10) > 0 ? parseInt(limit, 10) : 10;
        const start = page && parseInt(page, 10) > 0 ? parseInt(page, 10) : 1;
        const skip = (start - 1) * length;
        let filterQuery = {
            active: true,
            paymentStatus:"paid"
        };

        if (filter && filter.search !== undefined && filter.search !== "") {
            var searchRegex = new RegExp(`.*${filter.search}.*`, "i")
            filterQuery.$or = [
                { name: { $regex: searchRegex } },
            ]
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
        
        console.log(filterQuery);
        const aggregateQuery = [
            {
                $lookup: {
                    from: "users",
                    localField: "userId",
                    foreignField: "_id",
                    as: "usersObj"
                }
            },
            {
                $unwind: {
                    path: '$usersObj',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $match: filterQuery,
            },
            {
                $sort: sortQuery
            }
        ];
        const orderList = await ProductsModel.aggregate(aggregateQuery).skip(skip).limit(length);
        console.log(orderList)
        const totalResults = await ProductsModel.countDocuments(filterQuery);
        // console.log(totalResults);
        const totalPages = Math.ceil(totalResults / length);
        return {
            data: orderList,
            totalPages,
            totalResults,
            page: start,
            limit: length,
            status: true,
            code: 200,
        };
    } catch (error) {
        // console.log("Error while getting product list :", error)
        return { status: false, code: 500, msg: error }
    }
}

module.exports = admingetAllOrders