const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const shippingSchema = new Schema ({
  order: {type: mongoose.Types.ObjectId, ref: 'Order', required: true},
  shipper: {type: mongoose.Types.ObjectId, ref: 'User', required: true},
  estimated_time: {type: String, required: true}
},
{
  timestamps: {createdAt: 'confirmed_at'}
}
);

module.exports = mongoose.model('Shipping', shippingSchema);