const mongoose = require('mongoose');
const OrderModel = require('../order.model');

const getSalesByItem = async (filter,productId) => {
	
	try {
          let dailyData = [];
        let price = 0;
    
      
         const orders = await OrderModel.find({  createdAt: filter?.createdAt, paymentStatus: 'paid',"productDetail.productId": productId});

        if (!orders.length) {
          return { data: "No orders", status: true, code: 200 };
        } 
       
        orders.forEach((order) => {
            order.productDetail.forEach((cv) => {
              if (productId === cv.productId) {
                let data = {};
                data.price = cv.productDetailsObj.price;
                data.totalQuantity = cv.quantity;
                data.userId = order.userId;
          
                const orderDate = order.createdAt.toISOString().split("T")[0];
                const existingDailyDataIndex = dailyData.findIndex((item) => item.date === orderDate);
          
                if (existingDailyDataIndex !== -1) {
                  const existingUserIndex = dailyData[existingDailyDataIndex].data.findIndex(
                    (item) => item.userId === order.userId
                  );
                  if (existingUserIndex !== -1) {
                    dailyData[existingDailyDataIndex].data[existingUserIndex].totalQuantity += cv.quantity;
                  } else {
                    dailyData[existingDailyDataIndex].data.push(data);
                  }
                } else {
                  data.date = orderDate;
                  dailyData.push({
                   
                    data: data,
                  });
                }
              }
            });
          });
          let resultTodayData= [];

          if (dailyData.length) {
            for (let i = 0; i < dailyData.length; i++) {
                let found = false;
                if (resultTodayData.length) {
                    for (let j = 0; j < resultTodayData.length; j++) {
                     
                        if (JSON.stringify(resultTodayData[j]?.userId) == JSON.stringify(dailyData[i]?.data?.userId)) {
                            resultTodayData[j].totalQuantity += dailyData[i]?.data?.totalQuantity;
                            resultTodayData[j].totalCustomers += 1;

                            found = true;
                            break;
                        }
                    }
                }
                if (!found) {
                    resultTodayData.push({
                        date: dailyData[i].data.date,
                        totalQuantity: dailyData[i].data.totalQuantity,
                        price: dailyData[i].data.price,
                        userId: dailyData[i].data.userId,
                        totalCustomers:1
                    });
                }
            }
        }
        
          
          

  
		const productData = await OrderModel.aggregate([
            {
                $unwind: '$productDetail',
            },
            {
                $match: {
                    paymentStatus: 'paid',
                    createdAt: filter?.createdAt,
                    "productDetail.productId": productId,
                },
            },
            {
                $group: {
                    _id: "$productDetail.productId",
                    productName: { $last: '$productDetail.productDetailsObj.name' },
                    productImageUrl: { $last: '$productDetail.productDetailsObj.productImageUrl' },
                    totalQuantity: { $sum: "$productDetail.quantity" },
                    totalRevenue: { $sum: { $multiply: ["$productDetail.quantity", "$productDetail.productDetailsObj.price"] } },
                    uniqueUserIds: { $addToSet: "$userId" } // New field to store unique userIds
                }
            },
            
            {
                $project: {
                    _id: 0,
                    productId: "$_id",
                    productName: 1,
                    productImageUrl: 1,
                    totalQuantity: 1,
                    totalRevenue: 1,
                    totalCustomers: { $size: "$uniqueUserIds" }, // Calculate the count of unique userIds
                    uniqueUserIds:1,
                 

                }
            },
            {
                $sort: { totalRevenue: -1 } // Sort by totalRevenue in descending order (highest revenue first)
            },
            /* {
                $limit: 5,
            }, */
        ]);
        

		return {
			data: {productData,resultTodayData},
			status: true,
			code: 200,
		};
	} catch (error) {
		return { data: error.message, status: false, code: 500 };
	}
};

module.exports = getSalesByItem;
