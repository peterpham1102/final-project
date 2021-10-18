const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const shippingSchema = new Schema ({
  order_id: {type: mongoose.Types.ObjectId, ref: 'Order', required: true},
  shipper_id: {type: mongoose.Types.ObjectId, ref: 'User', required: true},
  estimated_time: {type: String, required: true}
},
{
  timestamps: {createdAt: 'created_at', updatedAt: 'updated_at'}
}
);

module.exports = mongoose.model('Shipping', shippingSchema);