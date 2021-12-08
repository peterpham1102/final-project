const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive'
};

const StoreSchema = new Schema(
  {
    name: { type: String, required: true },
    location: { type: String, required: true },
    description: { type: String, required: true },
    voucher: { type: String },
    image: { type: String, required: true },
    foods_id: [{ type: mongoose.Types.ObjectId, ref: 'Food' }],
    orders_id: [{type: mongoose.Types.ObjectId, ref: 'Order'}],
    rating: { type: Number },
    owner_id: { type: mongoose.Types.ObjectId, ref: 'User', required: true },
    status: {type: String, required: true,
      enum: [
        STATUS.ACTIVE,
        STATUS.INACTIVE
      ]
    },
    feedbacks_id: [{type: mongoose.Types.ObjectId, ref: 'Feedback'}]
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  }
);

module.exports = mongoose.model('Store', StoreSchema);
