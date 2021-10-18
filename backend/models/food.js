const mongoose = require('mongoose');

const Schema = mongoose.Schema;


const foodSchema = new Schema(
  {
    name: {type: String, required: true},
    description: {type: String, required: true},
    store_id: {type: mongoose.Types.ObjectId, ref: 'Store', required: true},
    categories_id: [{type: mongoose.Types.ObjectId, ref: 'Category', required: true}],
    rating:{type: Number},
    price: {type: Number, required: true},
    status: {type: String, required: true},
    image: {type: String, required: true}

  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
  }
);

module.exports = mongoose.model('Food', foodSchema);