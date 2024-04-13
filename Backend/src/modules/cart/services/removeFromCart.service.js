const  mongoose  = require('mongoose');
const CART_MODEL = require('../cart.model'); 

const removeFromCart = async (cartData) => {
  try {
 
    const existingCartItem = await CART_MODEL.findOne({
      productId: mongoose.Types.ObjectId(cartData.productId),
      userId: mongoose.Types.ObjectId(cartData.userId),
    });

    if (existingCartItem) {
      if (existingCartItem.quantity >1) {
        
        existingCartItem.quantity -= 1;
        cartItem=  await existingCartItem.save();
        return {
            data: cartItem,
            status: true,
            code: 200
        };
      } else {
     
        await existingCartItem.remove();
        return {
            data: "Product removed from cart successfully!",
            status: true,
            code: 200
        };
      }

   
   
    } else {
      throw new Error('Cart item not found');
    }
  } catch (error) {
    throw new Error(`Failed to remove item from cart: ${error.message}`);
  }
}

module.exports =  removeFromCart ;
