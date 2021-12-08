const { validationResult } = require("express-validator");
const HttpError = require("../models/http-error");
const mongoose = require("mongoose");

const Category = require("../models/category");

const createCategory = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()){
    return next(new HttpError("Invalid inputs, please try again!", 422));
  }

  const {name, description} = req.body;
  const createdCategory = new Category({
    name,
    description,
  });
  
  let existingCategory;
  try {
    existingCategory = await Category.findOne({ name: name });
  } catch (err) {
    const error = new HttpError(
      "Create category failed, please try again later.",
      500
    );
    return next(error);
  }

  if (existingCategory) {
    const error = new HttpError(
      "Category has already existed, please try again",
      422
    );
    return next(error);
  }
  



  try {
    await createdCategory.save();
  } catch (err) {
    const error = new HttpError('Creating category failed, please try again!', 500);
    return next(error);
  }

  res.status(201).json({
    message: 'Created successfully',
    category: createdCategory,
    success: 1
  })
};

const getCategories = async (req, res, next) => {
  let categories;
  try {
    categories = await Category.find().sort({ created_at: -1 });
  } catch (err) {
    const error = new HttpError(
      "Fetching data failed, please try again!",
       500);
    return next(error);
  }

  res.json({
    categories: categories.map((category) =>
      category.toObject({ getters: true })
    ),
    success : 1
  });
};

const getCategoryById = async(req, res, next) => {
  const categoryId = req.params.id;

  let category;
  try {
    category = await Category.findById(categoryId);
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not find category',
      500
    );
    return next(error);
  }

  if (!category) {
    const error = new HttpError(
      'Could not find any category for the provided id',
      404
    );
    return next(error);
  }
  res.json({
    category: category.toObject({getters: true})
  });
};

const updateCategory = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new HttpError("Invalid inputs, please try again!", 422);
  }

  const { name, description } = req.body;
  const categoryId = req.params.id;

  let category;
  try {
    category = await Category.findById(categoryId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not update category!",
      500
    );
    return next(error);
  }

  category.name = name;
  category.description = description;

  try {
    await category.save();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not update category!",
      500
    );
    return next(error);
  }

  res.status(200).json({ 
    messeage: 'Updated successfully',
    category: category.toObject({ getters: true }) });
};

const deleteCategory = async (req, res, next) => {
  const categoryId = req.params.id;

  let category;
  try {
    category = await Category.findById(categoryId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not delete category",
      500
    );
    return next(error);
  }

  try {
    await category.remove();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not delete category!",
      500
    );
    return next(error);
  }

  res.status(200).json({ message: "Deleted category!" });
}; 




exports.createCategory = createCategory;
exports.updateCategory = updateCategory;
exports.deleteCategory = deleteCategory;
exports.getCategories = getCategories;
exports.getCategoryById = getCategoryById;
