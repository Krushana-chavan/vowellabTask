const stripe = require('stripe')("sk_test_51P42dwSIoo6YwzN4ODZJvUlEpvT60eRhOZOPjRllkxKOJNOcDHEkNEbN2s1nBCe8T5vKKhy32Ne5i4hQo97PPx4x00JfAtqh2x");
const pick = require('../../../utils/pick');
const getAddressById = require('../../addresses/services/getAddressById.service');
const getOrdersById = require('../../orders/services/getOrderbyId.services');
const successOrder = require('../../orders/services/successOrder.services');
const stripePayment = async (req, res) => { 
    const {
        orderId
    } = await pick(req.body, ["orderId"]);


    let orderDetail = await getOrdersById(orderId)
    let id =orderDetail?.data?.shippingAdderess?.shippingAddressId;
    console.log(id)
    let addressObj = await getAddressById({id})
    console.log("addressObj", addressObj)
    let data = (orderDetail?.data?.productDetail)
  console.log(orderDetail)
 
    const lineItems = data && data.map((product) => ({
        price_data: {
            currency: "inr",
            product_data: {
                name: product.productDetailsObj.name,
                description: product.productDetailsObj.description,
                images: [product.productDetailsObj.productImageUrl],
            },
            unit_amount: (Number(product.price) * Number(product?.quantity) ) * 100 ,
        },
        quantity: 1, 
    }));
    

    const customer = await stripe.customers.create({
        name: `${addressObj?.data?.firstName} ${addressObj?.data?.lastName}`,
  address: {
    line1: `${addressObj?.data?.addressLine1}`,
    postal_code: `${addressObj?.data?.zip}`,
    city:`${addressObj?.data?.city}`,
    state: `${addressObj?.data?.state}`,
    country: 'US',
  },
    });

    const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: lineItems,
        mode: "payment",
        success_url: `http://localhost:3000/checkout/thankyou/${orderId}`,
        cancel_url: "http://localhost:3000",
        customer: customer.id 
    });

  await successOrder(orderId)
    console.log(session.id);
    res.json({ id: session.id });
};

module.exports = stripePayment;
