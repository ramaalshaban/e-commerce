const mongoose = require("mongoose");

const shopItemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  description: String,
  availableCount: Number,
  category: [String],
});

module.exports = mongoose.model("shopitem", shopItemSchema);
