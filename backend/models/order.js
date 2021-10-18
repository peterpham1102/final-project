const mongoose = require("mongoose");
const food = require("./food");

const Schema = mongoose.Schema;

const storeOrdered = new Schema(
  {
    store_id: { type: mongoose.Types.ObjectId, ref: "Store", required: true },
    food_id: { type: mongoose.Types.ObjectId, ref: "Food", required: true },
    quantity: { type: Number, required: true },
  },
  { _id: false }
);

const orderSchema = new Schema(
  {
    store_ordered: [storeOrdered],
    total_price: { type: Number, required: true },
    buyer_id: { type: mongoose.Types.ObjectId, ref: "User", required: true },
    description: { type: String, required: true },
    payment_method: { type: String, required: true },
    destination: { type: String, required: true },
    shipping_id: {
      type: mongoose.Types.ObjectId,
      ref: "Shipping",
    },
    status: { type: String, required: true },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

module.exports = mongoose.model("Order", orderSchema);
