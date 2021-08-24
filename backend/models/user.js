const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const ROLE = {
  ADMIN: 'admin',
  SELLER: 'seller',
  BUYER: 'buyer',
  SHIPPER: 'shipper'
};

const userSchema = new Schema(
  {
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true, minlength: 6},
    phone: {type: String, required: true},
    role: {
      type: String, required: true,
      enum: [
        ROLE.ADMIN,
        ROLE.SELLER,
        ROLE.BUYER,
        ROLE.SHIPPER
      ], default: ROLE.BUYER
    },
    image: {type: String},
    store_owned: {type: mongoose.Types.ObjectId, ref: 'Store'},
    orders_placed: {type: mongoose.Types.ObjectId, ref: 'Order'},
    orders_shipped: {type: mongoose.Types.ObjectId, ref: 'Shipping'}
    
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
  }
);

userSchema.plugin(uniqueValidator);
module.exports = mongoose.model('User', userSchema);