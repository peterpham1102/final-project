const mongoose = require("mongoose");

const Schema = mongoose.Schema;


const categorySchema = new Schema(
  {
    name: {type: String, required: true},
    description: {type: String, required: true},
    
    foods: [{type: mongoose.Types.ObjectId, ref: "Food"}]
    

  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
  }
);

module.exports = mongoose.model("Category", categorySchema);