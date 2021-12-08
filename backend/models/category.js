const mongoose = require("mongoose");

const Schema = mongoose.Schema;


const categorySchema = new Schema(
  {
    name: {type: String, required: true, unique: true},
    description: {type: String, required: true},
    
    foods_id: [{type: mongoose.Types.ObjectId, ref: "Food"}]
    

  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
  }
);

module.exports = mongoose.model("Category", categorySchema);