const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const orderSchema = new Schema({
  customerId: {
    type: Schema.Types.ObjectId,
    ref: "customer",
  },
  orderItems: [
    {
      title: String,
      price: Number,
      itemId: {
        type: Schema.Types.ObjectId,
        ref: "shopitem",
      },
    },
  ],
  bill: Number,
});

module.exports = mongoose.model("order", orderSchema);
