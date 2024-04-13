const mongoose = require("mongoose");
const { toJSON, paginate } = require("../../plugins");
const counterIncrementor = require("../../utils/counterIncrementer");
const orderSchema = mongoose.Schema(
  {
    productDetail: {
      type: Array,
      required: true,
    },
    orderNo: {
      type: mongoose.SchemaTypes.String,
    },
  
    userId: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
   
    paymentMode: {
      type: String,
      required: true,
      enum: ["online", "cash_on_delivery"],
    },
    paymentType: {
      type: String,
    },
    deliveryMethod:{
      type: String,
      required: true,
   
    },
    paymentStatus: {
      type: String,
      required: true,
      enum: ["paid", "unpaid", "partiallypaid", "failed"],
    },
    orderStatus: {
      type: String,
      enum: ["fulfilled", "unfulfilled", "partiallyfulfilled", "canceled"],
      default: "unfulfilled",
    },
    shippingAdderess: {
      type: Object,
    },
    amountToPay: {
      type: Number,
      default: 0,
    },
 
    active: {
      type: Boolean,
      default: true,
    },
    seqId: {
      type: Number,
    },

  },
  {
    timestamps: true,
  }
);
 
orderSchema.plugin(toJSON);
orderSchema.plugin(paginate);
orderSchema.pre("save", async function (next) {
  const doc = this;
  doc.seqId = await counterIncrementor("Order");
  doc.orderNo = `#` + (doc.seqId);
  next();
});

/**
 * @typedef Product
 */


const orderModel = mongoose.model("order", orderSchema);

module.exports = orderModel;
