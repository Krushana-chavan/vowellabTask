const httpStatus = require('http-status');
const catchAsync = require("../../../utils/catchAsync");
const pick = require('../../../utils/pick');
const { sendResponse } = require("../../../utils/responseHandler");
const orderServices = require("../services");
const moment = require("moment");


const addOrder = catchAsync(async (req, res) => {
	const {
		productDetail,
		paymentMode,
		paymentStatus,
		orderStatus,
		shippingAdderess,
		deliveryMethod,
		amountToPay,
		deliveryCharge,
		paymentType
	} = await pick(req.body,
		[
			"productDetail",
			"paymentMode",
			"paymentStatus",
			"orderStatus",
			"shippingAdderess",
			"deliveryMethod",
			"amountToPay",
			"deliveryCharge",
            "paymentType"

		]);

	const userId = req.user?.id

	const insertResult = await orderServices.addOrder({
		productDetail,
		paymentMode,
		paymentStatus,
		orderStatus,
		shippingAdderess,
		deliveryMethod,
		userId: userId,
		amountToPay,
		deliveryCharge,

		paymentType
	});

	if (insertResult?.status) {
	
		if(insertResult?.data?.paymentType=="pay360")
		{
			let ordersDetails= await orderServices.getOrdersById(insertResult?.data?._id);
			 //trigger place order email
			 try {
				let sAdd = ordersDetails?.data?.shippingAdderess?.shippingAddressObj;
	  
				let shippingAdderess = `<p style="margin-bottom:0;">${sAdd?.firstName || ""} ${sAdd?.lastName || ""}</p>
				<p style="margin-bottom:0;">${sAdd?.address || ""}</p>
				<p style="margin-bottom:0;">${sAdd?.addressLine2 || ""}</p>
				<p style="margin-bottom:0;">${sAdd?.city || ""}, ${sAdd?.state || ""}, ${sAdd?.zip || ""}</p>
				<p style="margin-bottom:0;">${sAdd?.country || ""}</p>
				<p>${sAdd?.phone || ""}</p>`;
				let country = sAdd?.country;
				// emailBody.shippingAdderess = shippingAdderess;
				let emailBody = {
				  orderNo: ordersDetails?.data?.orderNo,
				  productCount: ordersDetails?.data?.productDetail?.length,
				  deliveryCharge: ordersDetails?.data?.deliveryCharge,
				  name: `${sAdd?.firstName || ""} ${sAdd?.lastName || ""}`,
				  shippingAdderess: shippingAdderess,
				  amountToPay: ordersDetails?.data?.amountToPay,
	  
				  deliveryMethod: ordersDetails?.data?.deliveryMethod,
				};
				let productRows = ``;
				for (let i = 0; i < ordersDetails?.data?.productDetail.length; i++) {
				  const product = ordersDetails?.data?.productDetail[i];
				  console.log("product", product);
				  // Extract product details
				  const productImageUrl = product.productDetailsObj?.productImageUrl;
				  const productName = product?.productDetailsObj?.name;
				  const productPrice = product?.productDetailsObj?.price;
				  const productQuantity = product?.quantity;
	  
				  // Add this product to the productRows
				  productRows += `
						  
			
				  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
				  <div style="display: table; width: 100%; border-collapse: collapse; background-color: transparent;">
					  <div style="display: table-cell; vertical-align: top; width: 50%;">
						  <div style="box-sizing: border-box; padding: 0px; height: 100%; border-radius: 0px;">
							  <table role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
								  <tbody>
									  <tr>
										  <td style="overflow-wrap: break-word; word-break: break-word; padding: 30px; font-family: Arial, Helvetica, sans-serif;" align="left">
											  <table width="100%" cellpadding="0" cellspacing="0" border="0">
												  <tr>
													  <td style="padding-right: 0px; padding-left: 0px;" align="center">
														  <img src="${productImageUrl}" alt="" title="" style="outline: none; text-decoration: none; -ms-interpolation-mode: bicubic; clear: both; display: inline-block !important; border: none; height: auto; float: none; max-width: 240px; width: 100%;" width="240">
													  </td>
												  </tr>
											  </table>
										  </td>
									  </tr>
								  </tbody>
							  </table>
						  </div>
					  </div>
			  
					  <div style="display: table-cell; vertical-align: top; width: 50%;">
						  <div style="box-sizing: border-box; padding: 0px; height: 100%; border-radius: 0px;">
							  <table role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
								  <tbody>
									  <tr>
										  <td style="overflow-wrap: break-word; word-break: break-word; padding: 50px 10px 10px; font-family: Arial, Helvetica, sans-serif;" align="left">
											  <div style="font-size: 14px; line-height: 140%; text-align: left; word-wrap: break-word;">
												  <div><strong>${productName}</strong></div>
												  <div>&nbsp;</div>
												  <div>
													  <div>Price: ₹${productPrice}</div>
													  <div>Qty: ${productQuantity}</div>
												  </div>
												  <div>&nbsp;</div>
											  </div>
										  </td>
									  </tr>
								  </tbody>
							  </table>
						  </div>
					  </div>
				  </div>
			  </div>
			  
			
						  `;

	for (let j = 0; j < ordersDetails?.data?.productDetail[i]?.subProduct?.length; j++) {
	  const product2 = ordersDetails?.data?.productDetail[i]?.subProduct[j];
	  console.log("produc details 2----",product2)
	  const productImageUrl = product2.productDetailsObj?.productImageUrl;
	  const productName = product2?.productDetailsObj?.name;
	  const productPrice = product2?.productDetailsObj?.price;
	  const productQuantity = product2?.quantity;

	  // Add this product to the productRows
	  productRows += `
			  

	  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
	  <div style="display: table; width: 100%; border-collapse: collapse; background-color: transparent;">
		  <div style="display: table-cell; vertical-align: top; width: 50%;">
			  <div style="box-sizing: border-box; padding: 0px; height: 100%; border-radius: 0px;">
				  <table role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
					  <tbody>
						  <tr>
							  <td style="overflow-wrap: break-word; word-break: break-word; padding: 30px; font-family: Arial, Helvetica, sans-serif;" align="left">
								  <table width="100%" cellpadding="0" cellspacing="0" border="0">
									  <tr>
										  <td style="padding-right: 0px; padding-left: 0px;" align="center">
											  <img src="${productImageUrl}" alt="" title="" style="outline: none; text-decoration: none; -ms-interpolation-mode: bicubic; clear: both; display: inline-block !important; border: none; height: auto; float: none; max-width: 240px; width: 100%;" width="240">
										  </td>
									  </tr>
								  </table>
							  </td>
						  </tr>
					  </tbody>
				  </table>
			  </div>
		  </div>
  
		  <div style="display: table-cell; vertical-align: top; width: 50%;">
			  <div style="box-sizing: border-box; padding: 0px; height: 100%; border-radius: 0px;">
				  <table role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
					  <tbody>
						  <tr>
							  <td style="overflow-wrap: break-word; word-break: break-word; padding: 50px 10px 10px; font-family: Arial, Helvetica, sans-serif;" align="left">
								  <div style="font-size: 14px; line-height: 140%; text-align: left; word-wrap: break-word;">
									  <div><strong>${productName}</strong></div>
									  <div>&nbsp;</div>
									  <div>
										
										  <div>Qty: ${productQuantity}</div>
									  </div>
									  <div>&nbsp;</div>
								  </div>
							  </td>
						  </tr>
					  </tbody>
				  </table>
			  </div>
		  </div>
	  </div>
  </div>
  

			  `;
	
	}
				}
				emailBody.productRows = productRows;
				emailBody.country = country;
				emailBody.orderPlacedAt = moment(ordersDetails?.data?.createdAt).format(
				  "LLL"
				);
			
				sendResponse(res, httpStatus.OK, insertResult.data, null);
			}catch(e){
				console.log("erro ehilw sending mail",e)
			}

		}else{
		sendResponse(res, httpStatus.OK, insertResult.data, null);
		}
		return
	} else {
		sendResponse(res,
			insertResult.code == 400 ? httpStatus.BAD_REQUEST
				: insertResult.code == 500 ? httpStatus.INTERNAL_SERVER_ERROR
					: httpStatus.BAD_REQUEST, null, insertResult.msg);
	}
});



module.exports = addOrder;