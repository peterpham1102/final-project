const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const StoreSchema = new Schema(
  {
    name: { type: String, required: true },
    location: { type: String, required: true },
    description: { type: String, required: true },
    voucher: { type: String, required: true },
    image: { type: String, required: true },
    foods: [{ type: mongoose.Types.ObjectId, ref: 'Food' }],

    rating: { type: Number },
    owner: { type: mongoose.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, required: true },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  }
);

module.exports = mongoose.model('Store', StoreSchema);
