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
    status: "Active"
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
    const error = new HttpError(
      "Creating store failed, please try again.",
      500
    );
    return next(error);
  }
  res.status(201).json({
    store: createdStore
  })
  
};

const getStores = async(req, res, next) => {
  let stores;
  try {
    stores = await Store.find().sort({"created_at": -1});
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
    userWithStore = await User.findById(userId);
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

};






exports.createStore = createStore;
exports.getStores = getStores;
exports.getStoreById = getStoreById;
exports.getStoreByUserId = getStoreByUserId;
exports.updateStore = updateStore;