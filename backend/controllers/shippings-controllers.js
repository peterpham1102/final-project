const { validationResult } = require("express-validator");
const HttpError = require("../models/http-error");
const mongoose = require("mongoose");

const Shipping = require("../models/shipping");
const User = require("../models/user");
const Order = require("../models/order");

const createShipping = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError("Invalid inputs, please try again!", 422));
  }
  const userId = req.userData.userId

  const {   
    // estimated_time,
    order_id
   } = req.body;

  let user;
  try {
    user = await User.findById(userId)
  } catch (err) {
    const error = new HttpError("Create shipping failed, please try again!", 500);
    return next(error);
  }

  if (!user) {
    const error = new HttpError(
      "Could not find any user for provided id.",
      404
    );
    return next(error);
  }

  let order;
  try {
    order = await Order.findById(order_id)
  } catch (err) {
    const error = new HttpError("Create shipping failed, please try again!", 500);
    return next(error);
  }

  if (!order) {
    const error = new HttpError(
      "Could not find any order for provided id.",
      404
    );
    return next(error);
  }

  
  const createdShipping = new Shipping({
    estimated_time: "20 minutes",
    order_id: order_id,
    shipper_id: userId
  });

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await createdShipping.save({ session: sess });
    user.orders_shipped_id.push(createdShipping)
    order.shipping_id = createdShipping._id;
    await user.save({session: sess})
    await order.save({session: sess})
    await sess.commitTransaction();


  } catch (err) {
    const error = new HttpError('Creating shipping failed, please try again!', 500);
    return next(error);
  }

  res.status(201).json({
    success: 1,
    message: 'Created successfully',
    shipping: createdShipping
  })
};

const getShippings = async (req, res, next) => {
  let shippings;
  try {
    shippings = await Shipping.find().sort({ created_at: -1 })
    // .populate('order_id');
  } catch (err) {
    const error = new HttpError(
      "Fetching data failed, please try again!",
      500);
    return next(error);
  }

  res.json({
    shippings: shippings
  });
};

const getShippingById = async (req, res, next) => {
  const shippingId = req.params.id;

  let shipping;
  try {
    shipping = await Shipping.findById(shippingId);
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not find shipping',
      500
    );
    return next(error);
  }

  if (!shipping) {
    const error = new HttpError(
      'Could not find any shipping for the provided id',
      404
    );
    return next(error);
  }
  res.json({
    shipping: shipping.toObject({ getters: true })
  });
};

const updateShipping = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new HttpError("Invalid inputs, please try again!", 422);
  }

  const { estimated_time } = req.body;
  const shippingId = req.params.id;

  let shipping;
  try {
    shipping = await Shipping.findById(shippingId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not update shipping!",
      500
    );
    return next(error);
  }

  shipping.estimated_time = estimated_time;
  

  try {
    await shipping.save();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not update shipping!",
      500
    );
    return next(error);
  }

  res.status(200).json({
    messeage: 'Updated successfully',
    shipping: shipping.toObject({ getters: true })
  });
};

const deleteShipping = async (req, res, next) => {
  const shippingId = req.params.id;

  let shipping;
  try {
    shipping = await Shipping.findById(shippingId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not delete shipping",
      500
    );
    return next(error);
  }

  try {
    await shipping.remove();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not delete shipping!",
      500
    );
    return next(error);
  }

  res.status(200).json({ message: "Deleted shipping!" });
};

const getShippingByUserId = async (req, res, next) => {
  const userId = req.params.id;

  let userWithShippings;
  
  try {
    userWithShippings = await User.findById(userId)
      .populate("orders_shipped_id")
      .sort({ created_at: -1 });
  } catch (err) {
    const error = new HttpError("Fetching data failed, please try again!", 500);

    return next(error);
  }

  

  if (
    !userWithShippings ||
    userWithShippings.orders_shipped_id.length === 0
  ) {
    return next(
      new HttpError("Could not find shippings for provided user id", 404)
    );
  }
  // console.log(userWithOrders);
  res.json({
    success: 1,
    shippings: userWithShippings
    // .orders_shipped_id
    // .map((shipping) =>
    // shipping.toObject()
    // ),

    
  });
};




exports.createShipping = createShipping;
exports.updateShipping = updateShipping;
exports.deleteShipping = deleteShipping;
exports.getShippings = getShippings;
exports.getShippingById = getShippingById;
exports.getShippingByUserId = getShippingByUserId;
