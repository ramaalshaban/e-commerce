const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const cartSchema = new Schema({
  customerId: {
    type: Schema.Types.ObjectId,
    ref: "customer",
  },
  items: [
    {
      title: String,
      price: Number,
      image: String,
      description: String,
      itemId: {
        type: Schema.Types.ObjectId,
        ref: "shopitem",
      },
      quantity: Number,
    },
  ],
});

module.exports = mongoose.model("cart", cartSchema);
