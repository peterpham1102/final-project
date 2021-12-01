const mongoose = require("mongoose");

const Schema = mongoose.Schema;


const feedbackSchema = new Schema(
  {
    rating: {type: Number, required: true},
    content: {type: String, required: true},
    
    store_id: {type: mongoose.Types.ObjectId, ref: "Store", required: true}
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
  }
);

module.exports = mongoose.model("Feedback", feedbackSchema);