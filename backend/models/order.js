const mongoose = require("mongoose");
// const food = require("./food");

const Schema = mongoose.Schema;

const STATUS = {
  PENDING: "Pending",
  PROCESSING: "Processing",
  DELIVERING: "Delivering",
  CANCELED: "Canceled",
  DELIVERED: "Delivered",
};

const storeOrdered = new Schema(
  {
    store_id: { type: mongoose.Types.ObjectId, ref: "Store", required: true },
    store_name:{ type: String,
       required: true 
    },
    food_id: { type: mongoose.Types.ObjectId, ref: "Food", required: true },
    food_name: { type: String,
       required: true 
    },
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
    status: {
      enum: [
        STATUS.PENDING,
        STATUS.DELIVERING,
        STATUS.PROCESSING,
        STATUS.DELIVERED,
        STATUS.CANCELED,

      ], 
      type: String, 
      required: true

     },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

module.exports = mongoose.model("Order", orderSchema);
