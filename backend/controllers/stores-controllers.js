const { validationResult } = require("express-validator");
const HttpError = require("../models/http-error");
const mongoose = require("mongoose");

const Store = require("../models/store");
const Food = require('../models/food');
const Order = require('../models/order');
const User = require('../models/user');

const createStore = async(req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()){
    return next(new HttpError("Invalid inputs, please try again!", 422));
  }

  const {
    name,
    location, 
    description,
    voucher,
    image,
    rating,

  } = req.body;

  const createdStore = new Store({
    name,
    location,
    description,
    voucher,
    image,
    rating,
    owner_id: req.userData.userId,
    status: "active"
  });

  let user;
  
  try {
    user = await User.findById(req.userData.userId);
  } catch (err) {
    const error = new HttpError(
      "Creating store failed, please try again.",
      500
    );
    return next(error);
  }
  if (!user) {
    const error = new HttpError("Could not find user for provided id.", 404);
    return next(error);
  }

  if (user.store_owned_id) {
    const error = new HttpError("You have already owned a store!", 500);
    return next(error);
  }
  
  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await createdStore.save({session: sess});
    user.store_owned_id = createdStore;
    await user.save({session: sess});
    await sess.commitTransaction();

  } catch (err) {
    // const error = new HttpError(
    //   "Creating store failed, please try again.",
    //   500
    // );
    // return next(error);
    console.log(err)
  }
  res.status(201).json({
    success: 1,
    store: createdStore
  })
  
};

const getStores = async(req, res, next) => {
  let stores;
  try {
    stores = await Store.find().sort({ created_at: -1 })
  } catch (err) {
    const error = new HttpError('Fetching data failed, please try again!', 500);
    return next(error);
  }
  res.json({
    stores: stores.map((store) => 
      store.toObject({getters: true})
    )
  });
};

const getStoreById = async(req, res, next) => {
  const storeId = req.params.id;
  let store;
  try {
    store = await Store.findById(storeId);
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not find any store!',
      500
    );
    return next(error);
  }
  if(!store) {
    const error = new HttpError(
      'Could not find any store for provided id!',
      404
    );
    return next(error);
  }
  res.json({
    store: store.toObject({getters: true})
  });

};

const getStoreByUserId = async(req, res, next) => {
  const userId = req.params.id;
  let userWithStore;
  try {
    userWithStore = await User.findById(userId).sort({ created_at: -1 })
    if (!userWithStore.store_owned_id) {
      return next(new HttpError("Could not find any store for provided id!", 404));
    }
    userWithStore = await User.findById(userId).populate('store_owned_id')
    console.log(userWithStore);
  } catch (err) {
    const error = new HttpError("Fetching data failed, please try again", 500);
    return next(error);
  }
  // if (!userWithStore ) {
  //   return next(new HttpError("Could not find any store for provided id!", 404));
  // }
  res.json({
    store: userWithStore.store_owned_id.toObject({getters: true})
  });

};

const updateStore = async(req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new HttpError("Invalid inputs, please try again!", 422);
  }

  const { name, location, description, 
    // image 
  } = req.body;
  const storeId = req.params.id;
  console.log(req.body);
  let store;
  try {
    store = await Store.findById(storeId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not update store!2",
      500
    );
    return next(error);
  }

  store.name = name;
  store.location = location;
  store.description = description;
  // store.image = image;

  try {
    await store.save();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not update store!3",
      500
    );
    return next(error);
  }

  res.status(200).json({
    success: 1,
    store: store.toObject({ getters: true }),
  });
};

const searchStoreByFoodName = async (req, res, next) => {
  const key = req.params.key
  console.log("key ", key)
  
  let searchFoods;
  let storesOfSearchFoodsId
  let storeWithFood
  let listStores = []
  try {
    searchFoods = await Food.find({name: { $regex: '.*' + key + '.*' } })
    
  } catch (err) {
    console.log("Can't find any food by provided key words")
  }
  storesOfSearchFoodsId = searchFoods.map(food => food.store_id)
  for (const storeId of storesOfSearchFoodsId) {
    storeWithFood = await Store.findById(storeId)
    listStores.push(storeWithFood)
  }

  res.json({
    stores: listStores.map(store => store.toObject()),
    
  })

}

const updateStoreStatus = async (req, res, next) => {
  const storeId = req.params.id
  const { status } = req.body;
  let store;
  try {
    store = await Store.findById(storeId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not update status store!",
      500
    );
    return next(error);
  }

  if (
    !store ||
    store.length === 0
  ) {
    return next(
      new HttpError("Could not find store for provided user id", 404)
    );
  }

  store.status = status;
  try {
    await store.save();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not update order!",
      500
    );
    return next(error);
  }

  res.status(200).json({
    success: 1,
    store: store.toObject(),
  });
};





exports.createStore = createStore;
exports.getStores = getStores;
exports.getStoreById = getStoreById;
exports.getStoreByUserId = getStoreByUserId;
exports.updateStore = updateStore;
exports.searchStoreByFoodName = searchStoreByFoodName;
exports.updateStoreStatus = updateStoreStatus;
