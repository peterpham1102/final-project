const { validationResult } = require("express-validator");
const HttpError = require("../models/http-error");
const mongoose = require("mongoose");

const Store = require("../models/store");
const Food = require("../models/food");
const Category = require("../models/category");

const createFood = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError("Invalid inputs, please try again!", 422));
  }

  const { name, description, store_id, categories_id, image, rating, price } =
    req.body;

  const createdFood = new Food({
    name,
    description,
    store_id,
    categories_id,
    rating,
    image,
    price,
    orders_count: 0,
    status: "active",
  });


  let store;
  try {
    store = await Store.findById(store_id);
    
  } catch (err) {
    const error = new HttpError("Create food failed, please try again!", 500);
    return next(error);
  }
  if (!store) {
    const error = new HttpError(
      "Could not find any store for provided id.",
      404
    );
    return next(error);
  }

  let categories;
  console.log(req.body.categories_id);
  // console.log('before ' + categories);
  try {
    // categories = await Category.find({ _id: categories_id });
    categories = await Category.findById(categories_id)
  } catch (err) {
    const error = new HttpError("Create food failed, please try again!", 500);
    return next(error);
  }

  if (!categories) {
    const error = new HttpError(
      "Could not find any category for provided id.",
      404
    );
    return next(error);
  }

  console.log('after ' + categories);
  try {
    const sess = await mongoose.startSession();
    // console.log("in db " + categories);
    // console.log(typeof(categories));

    sess.startTransaction();
    await createdFood.save({ session: sess });
    
    store.foods_id.push(createdFood);
    
    // categories.forEach(async (cat) => {
      categories.foods_id.push(createdFood);

    //   await cat.save({ session: sess });
    // });

    // for (cat in categories) {
    //   categories[cat].foods_id.push(createdFood);
    //   categories[cat].save({ session: sess });
    // }
    await store.save({ session: sess });
    await categories.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    // const error = new HttpError("Creating food failed, please try again!", 500);
    // return next(error);
    console.log(err)
  }
  res.status(201).json({
    success: 1,
    food: createdFood,
  });
};

const getFoods = async (req, res, next) => {
  let foods;
  try {
    foods = await Food.find().sort({ orders_count: -1 });
    
  } catch (err) {
    const error = new HttpError("Fetching data failed, please try again!", 500);
    return next(error);
  }
  res.json({
    foods: foods.map((food) => food.toObject({ getters: true })),
    
  });
};

const getFoodById = async (req, res, next) => {
  const foodId = req.params.id;
  let food
  try {
    food = await Food.findById(foodId);    
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not find any food!',
      500
    );
    return next(error);
  } 
  if(!food) {
    const error = new HttpError(
      'Could not find any food with provided id',
      404
    );
    return next(error);
  }
  res.json({
    food: food.toObject({getters: true})
  });
};

const getFoodsByStoreId = async (req, res, next) => {
  const storeId = req.params.id;
  let storeWithFoods;
  try {
    storeWithFoods = await Store.findById(storeId)
    .populate('foods_id')
    .sort({ orders_count: -1  });
  } catch (err) {
    console.log("err: ", err);
    const error = new HttpError("Fetching data failed, please try again!", 500);
    res.json({
      success: 0,
      message: "Failed",
    });
    return next(error);
  }

  // if (!storeWithFoods || storeWithFoods.length === 0) {
  //   return next(
  //     new HttpError("Could not find foods for provided store id", 404)
  //   );
  // }
  res.json({
    success: 1,
    foods: storeWithFoods.foods_id.map((food) =>
      food.toObject({ getters: true })
    ),
  });
}

const updateFood = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new HttpError(
      'Invalid inputs, please try again!', 422
    );
  }
  const {name, description, price,
    //  image
    } = req.body;
  const foodId = req.params.id;
  let food;
  try {
    food = await Food.findById(foodId);
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not find food',
      500
    );
    return next(error);
  }
  food.name = name;
  food.description = description;
  food.price = price;
  // food.image = image;

  try {
    await food.save();
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not update food', 500
    );
    return next(error);
  }

  res.status(200).json({
    message: 'Updated food successfully',
    food: food.toObject({getters: true})
  });
  
}

const getFoodsByCategoryId = async (req, res, next) => {
  const categoryId = req.params.id;
  let categoryWithFoods;
  try {
    categoryWithFoods = await Category.findById(categoryId)
    .populate('foods_id')
    .sort({ created_at: -1 });
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
    foods: categoryWithFoods.foods_id.map((food) =>
      food.toObject({ getters: true })
    ),
  });
}

const updateFoodStatus = async (req, res, next) => {
  const userId = req.userData.userId;
  const foodId = req.params.id
  const { status } = req.body;
  let food;
  try {
    food = await Food.findById(foodId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not update status food!",
      500
    );
    return next(error);
  }


  if (
    !food ||
    food.length === 0
  ) {
    return next(
      new HttpError("Could not find food for provided user id", 404)
    );
  }

  food.status = status;
  try {
    await food.save();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not update order!",
      500
    );
    return next(error);
  }

  res.status(200).json({
    success: 1,
    food: food.toObject(),
  });
};






exports.createFood = createFood;
exports.getFoods = getFoods;
exports.getFoodById = getFoodById;
exports.getFoodsByStoreId = getFoodsByStoreId
exports.updateFood = updateFood;
exports.getFoodsByCategoryId = getFoodsByCategoryId;
exports.updateFoodStatus = updateFoodStatus;