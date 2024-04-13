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

        let andFilter = []
        let paymentStatusFilter = []
        let orderStatusFilter = []
        let searchFilter = []
        let deliveryFilter = []
        let dateFilter = []
        if(filter?.DatePayload){
            if (filter?.DatePayload.fromDate && filter?.DatePayload.toDate) {
                const fromDate = new Date(filter?.DatePayload.fromDate);
                let toDate = new Date(filter?.DatePayload.toDate);
                toDate.setHours(23);
                toDate.setMinutes(59);
                toDate.setSeconds(59);
                filter.DatePayload = {
                  ...filter?.DatePayload,
                  createdAt: { $gte: fromDate, $lt: toDate },
                };
                delete filter?.DatePayload.fromDate;
                delete filter?.DatePayload.toDate;

                dateFilter.push(filter?.DatePayload)
                // filterQuery = { ...filterQuery, ...filter?.DatePayload} 
              }
        }
        if (filter?.orderNo) {
            searchFilter.push({ orderNo: { $regex: filter.orderNo, $options: "i" } })
            searchFilter.push({ "usersObj.username": { $regex: filter.orderNo, $options: "i" } })
        }

        if (filter?.fulfilledChecked==true) orderStatusFilter.push({ orderStatus:"fulfilled" })
        if (filter?.unfulfilledChecked==true) orderStatusFilter.push({ orderStatus:"unfulfilled" })
        if (filter?.partiallyFulfilledChecked==true) orderStatusFilter.push({ orderStatus:"partiallyfulfilled" })
        if (filter?.canceledChecked==true) orderStatusFilter.push({ orderStatus:"canceled" })

        if (filter?.paidChecked==true) paymentStatusFilter.push({ paymentStatus:"paid" })
        if (filter?.unpaidChecked==true) paymentStatusFilter.push({ paymentStatus:"unpaid" })
        if (filter?.partiallyPaidChecked==true) paymentStatusFilter.push({ paymentStatus:"partiallypaid" })
        if (filter?.refundedChecked==true) paymentStatusFilter.push({ paymentStatus:"refunded" })

       
        if(paymentStatusFilter.length) andFilter.push({$or:paymentStatusFilter})
        if(orderStatusFilter.length) andFilter.push({$or:orderStatusFilter})
        if(searchFilter.length) andFilter.push({$or:searchFilter})
        if(deliveryFilter.length) andFilter.push({$or:deliveryFilter})
        if(dateFilter.length) andFilter.push({$or:dateFilter})

        if(andFilter.length) filterQuery = {...filterQuery, ...{$and:andFilter}}
       
        
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
        const ProductList = await ProductsModel.aggregate(aggregateQuery).skip(skip).limit(length);
        const totalResults = await ProductsModel.countDocuments(filterQuery);
        // console.log(totalResults);
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
        // console.log("Error while getting product list :", error)
        return { status: false, code: 500, msg: error }
    }
}

module.exports = admingetAllOrders