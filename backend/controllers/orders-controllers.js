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
  let arrFood = [];
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
        arrFood.push(food);
        sum += food.price * el.quantity;
        // console.log('food price ' + food.price + ' ' + el.quantity);
        // console.log('sum ' + sum);

      }
    } catch (err) {
      // const error = new HttpError(
      //   'Something went wrong, could not calculate total price!', 500
      // );
      // return next(error);
      console.log("arrFood ", arrFood)
    }

  // console.log('sum after looping ' + sum);
  let storeByFood;
  try {
    storeByFood = await Food.findById(food_id).populate("store_id")
    console.log("storeByFood ", storeByFood);
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not find store for provided food id', 500
    );
    return next(error);
  }

  // let listStoreOrdered = [];
  console.log("req.body.store_ordered ", req.body.store_ordered)
  const listStoreOrdered = req.body.store_ordered.map((store, i) => {
    
    return {
      store_id: storeByFood.store_id,
      store_name: storeByFood.store_id.name,
      food_id: store.food_id,
      food_name: arrFood[i].name,
      quantity: store.quantity 
    }
  }); 
  
  // if (listStoreOrdered) {
    const createdOrder = new Order({
      store_ordered: listStoreOrdered,
      total_price: sum,
      buyer_id: req.userData.userId,
      description,
      payment_method,
      destination,
      status: "Pending",
    });
  // }

  
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
      
      arrFood.forEach(async (food) => {
        food.orders_count++;
        await food.save({session: sess})
      })
      console.log("arr Food: ", arrFood)

      user.orders_placed_id.push(createdOrder);
      store.orders_id.push(createdOrder);

      await user.save({session: sess});
      await store.save({session: sess});
      await sess.commitTransaction();
    } catch (err) {
      // const error = new HttpError(
      //   "Creating order failed, please try again.",
      //   500
      // );
      // return next(error);
      console.log(err)
    }
  res.status(200).json({
    order: createdOrder,
    success: 1
  });
};

const getOrders = async(req, res, next) => {
  let orders;
  try {
    orders = await Order.find().sort({ created_at: -1 });
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

const getProcessingOrders = async(req, res, next) => {
  let orders;
  try {
    orders = await Order.find({status: "Processing"}).sort({ created_at: -1 });
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

const getOrdersByStoreId = async (req, res, next) => {
  const storeId = req.params.id;
  let storeWithOrders;
  let buyer;
  
  try {
    storeWithOrders = await Store.findById(storeId)
    
    .populate({path: 'orders_id', options: {sort: {created_at: -1}},
    populate: [
      {path: "buyer_id"}
    ]
    }
    )
    
     

    
  } catch (err) {
    console.log("err: ", err);
    const error = new HttpError("Fetching data failed, please try again!", 500);
    res.json({
      success: 0,
      message: "Failed",
    });
    return next(error);
  }

  res.json({
    success: 1,
    orders: storeWithOrders.orders_id.map((order) =>
      order.toObject()
    ),
    
    
  });
}

const getOrderByUserId = async (req, res, next) => {
  const userId = req.params.id;

  let userWithOrders;
  
  try {
    userWithOrders = await User.findById(userId)
      .populate({path :"orders_placed_id", options: {sort: {created_at: -1}}})
      
  } catch (err) {
    const error = new HttpError("Fetching data failed, please try again!", 500);

    return next(error);
  }
  // for (const order of userWithOrders.orders_placed_id) {
  //   order.store_ordered.forEach(async store => {
  //     let storeInfo = await Store.findById(store.store_id)
  //     let foodInfo = await Food.findById(store.food_id)
  //   })
  // }
 
  
  // try {
  //   info = await Store.findById(userWithOrders.orders_placed_id
  //     .map(order => order.store_ordered.map(item => item.store_id))[0][0])
  // } catch (err) {
  //   console.log(err)
  // }
  

  if (
    !userWithOrders ||
    userWithOrders.orders_placed_id.length === 0
  ) {
    return next(
      new HttpError("Could not find orders for provided user id", 404)
    );
  }
  console.log(userWithOrders);
  res.json({
    success: 1,
    orders: userWithOrders.orders_placed_id
    .map((order) =>
      order.toObject()
    ),

    
  });
};

const getOrderByShipperId = async (req, res, next) => {
  const userId = req.params.id;

  let shipperWithOrders;
  
  try {
    shipperWithOrders = await User.findById(userId)
      .populate({ path:"orders_shipped_id", options: {sort: {created_at: -1}},
      populate : [
        {path: "order_id"}
      ]
    })
    
  } catch (err) {
    const error = new HttpError("Fetching data failed, please try again!", 500);

    return next(error);
  }

  if (
    !shipperWithOrders ||
    shipperWithOrders.orders_shipped_id.length === 0
  ) {
    return next(
      new HttpError("Could not find orders for provided user id", 404)
    );
  }
  console.log(shipperWithOrders);
  res.json({
    success: 1,
    orders: shipperWithOrders
    .orders_shipped_id

    
  });
};





const updateOrderStatus = async (req, res, next) => {
  const userId = req.params.id;
  const orderId = req.params.id;
  const { status } = req.body;
  let order;
  try {
    order = await Order.findById(orderId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not update status order!",
      500
    );
    return next(error);
  }

  if (
    !order ||
    order.length === 0
  ) {
    return next(
      new HttpError("Could not find orders for provided user id", 404)
    );
  }

  order.status = status;
  try {
    await order.save();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not update order!",
      500
    );
    return next(error);
  }

  res.status(200).json({
    success: 1,
    order: order.toObject(),
  });
};




exports.createOrder = createOrder;
exports.getOrders = getOrders;
exports.getProcessingOrders = getProcessingOrders;
exports.getOrdersByStoreId = getOrdersByStoreId;
exports.getOrderByUserId = getOrderByUserId;
exports.getOrderByShipperId = getOrderByShipperId;

exports.updateOrderStatus = updateOrderStatus;
