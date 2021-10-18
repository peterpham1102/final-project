const { validationResult } = require("express-validator");
const HttpError = require("../models/http-error");
const mongoose = require("mongoose");

const Food = require("../models/food");
const User = require("../models/user");
const Order = require('../models/order');
const Store = require("../models/store");
const Shipping = require("../models/shipping");

const createOrder = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError("Invalid inputs, please try again!", 422));
  }
  const {
    store_ordered: [{ 
      food_id,
      quantity 
    }],   
    description,
    payment_method,
    destination
  } = req.body;
  
  // req.body.store_ordered.forEach(el => {
  //   console.log(el.food_id, el.quantity);
  // });
  let food;
  let sum = 0;
  
    try {
      // req.body.store_ordered.forEach(async (el) => {
      //   food = await Food.findById(el.food_id);
      //   sum += food.price * el.quantity;
      //   console.log('food price ' + food.price + ' ' + el.quantity);
      //   console.log('sum ' + sum); 
      // })
      for (const el of req.body.store_ordered) {
        food = await Food.findById(el.food_id);
        sum += food.price * el.quantity;
        // console.log('food price ' + food.price + ' ' + el.quantity);
        // console.log('sum ' + sum);

      }
    } catch (err) {
      const error = new HttpError(
        'Something went wrong, could not calculate total price!', 500
      );
      return next(error);
    }

  // console.log('sum after looping ' + sum);
  let storeByFood;
  try {
    storeByFood = await Food.findById(food_id)
    // console.log(storeByFood);
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not find store for provided food id', 500
    );
    return next(error);
  }

  // let listStoreOrdered = [];
  const listStoreOrdered = req.body.store_ordered.map(store => {
    return {
      store_id: storeByFood.store_id,
      food_id: store.food_id,
      quantity: store.quantity 
    }
  }); 
  

  const createdOrder = new Order({
    store_ordered: listStoreOrdered,
    total_price: sum,
    buyer_id: req.userData.userId,
    description,
    payment_method,
    destination,
    status: "Processing",
  });
  // console.log('created order ' + createdOrder);

  let user;
  try {
    user = await User.findById(req.userData.userId);
  } catch (err) {
    const error = new HttpError(
      "Creating order failed, please try again.",
      500
    );
    return next(error);
  }

  if (!user) {
    const error = new HttpError("Could not find user for provided id.", 404);
    return next(error);
  }


  // console.log('type ' + typeof(storeByFood));
  // console.log('storeByFood ' + storeByFood.populate('store_id'));
  let store
  try {
    store = await Store.findById(storeByFood.store_id);
  } catch (err) {
    const error = new HttpError(
      'Could not find any store, please try again', 404
    );
    return next(error);
  }
  // console.log('store ' + store);

    try {
      const sess = await mongoose.startSession();
      sess.startTransaction();
      // store_ordered.markModified("store_ordered");
      console.log('created order ' + createdOrder)

      
      await createdOrder.save({ session: sess });
      
      
      user.orders_placed_id.push(createdOrder);
      store.orders_id.push(createdOrder);
      await user.save({session: sess});
      await store.save({session: sess});
      await sess.commitTransaction();
    } catch (err) {
      const error = new HttpError(
        "Creating order failed, please try again.",
        500
      );
      return next(error);
      // return next(err);
    }
  res.status(200).json({
    order: createdOrder
  });
};

const getOrders = async(req, res, next) => {
  let orders;
  try {
    orders = await Order.find().sort({"created_at": -1, });
  } catch (err) {
    const error = new HttpError(
      'Fetching data failed, please try again!', 500);
    return next(error);
  }
  res.json({
    orders: orders.map((order) => 
    order.toObject()
    )
  })
};

exports.createOrder = createOrder;
exports.getOrders = getOrders;