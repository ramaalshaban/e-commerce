const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const customerSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  firstname: {
    type: String,
  },
  lastname: {
    type: String,
  },
  password_hash: {
    type: String,
    required: true,
  },
  cart: {
    type: Schema.Types.ObjectId,
    ref: "cart",
  },
});

module.exports = mongoose.model("customer", customerSchema);
