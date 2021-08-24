const mongoose = require('mongoose');
const food = require('./food');

const Schema = mongoose.Schema;

const orderSchema = new Schema({
  foods: [{type: mongoose.Types.ObjectId, ref: 'Food', required: true, quantity: {type: Number, required: true},}],
  // quantity: {type: Number, required: true},
  total: {type: Number, required: true},
  buyer: {type: mongoose.Types.ObjectId, ref: 'User', required: true},
  description: {type: String, required: true},
  payment_method: {type: String, required: true},
  destination: {type: String, required: true},
  shipping: {type: mongoose.Types.ObjectId, ref: 'Shipping', required: true},
  status: {type: String, required: true},
  
},
{
  timestamps: {createdAt: 'created_at', updatedAt: 'updated_at'}
}
);

module.exports = mongoose.model('Order', orderSchema);