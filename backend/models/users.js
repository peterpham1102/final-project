const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const Schema = mongoose.Schema;

const ROLE = {
  ADMIN: "admin",
  SELLER: "seller",
  CUSTOMER: "customer",
  SHIPPER: "shipper"
};

const userSchema = new Schema(
  {
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true, minlength: 6},
    phoneNumber: {type: String, required: true},
    

  }
);

userSchema.plugin(uniqueValidator);
module.exports = mongoose.model("User", userSchema);