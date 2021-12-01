const { validationResult } = require("express-validator");
const { v4: uuidv4 } = require("uuid");
uuidv4();
const HttpError = require("../models/http-errors");

const User = require("../models/user");
const Store = require("../models/store");
const Feedback = require("../models/feedback");

const mongoose = require("mongoose");

const getFeedbacks = async (req, res, next) => {
  let feedbacks;

  try {
    feedbacks = await Feedback.find();
  } catch (err) {
    const error = new HttpError("Fetching data failed, please try again!", 500);
    return next(error);
  }

  res.json({
    success: 1,
    feedbacks: feedbacks.map((feedback) => feedback.toObject({ getters: true })),
  });
};

const getFeedbackById = async (req, res, next) => {
  const feedbackId = req.params.id;
  let feedbacks;
  try {
    feedbacks = await Feedback.findById(feedbackId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not find reply store",
      500
    );
    return next(error);
  }
  if (!feedbacks) {
    const error = new HttpError(
      "Could not find a reply store for the provided id!",
      404
    );
    return next(error);
  }
  res.json({ feedbacks: feedbacks.toObject({ getters: true }) });
};

const createFeedback = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError("Invalid inputs, please try again!", 422));
  }

  const { rating, content, store_id } = req.body;

  const createdFeedback = new Feedback({
    rating,
    content,
    creatorId: req.userData.userId,
    store_id,
  });


  let user;
  try {
    user = await User.findById(req.userData.userId);
  } catch (err) {
    const error = new HttpError(
      "Creating feedback failed, please try again.",
      500
    );
    return next(error);
  }

  if (!user) {
    const error = new HttpError("Could not find user for provided id.", 404);
    return next(error);
  }

  console.log(user);

  let store;
  try {
    store = await Store.findById(store_id);
  } catch (err) {
    const error = new HttpError(
      "Creating feedback failed, please try again.",
      500
    );
    return next(error);
  }

  if (!store) {
    const error = new HttpError(
      "Could not find store for provided id.",
      404
    );
    return next(error);
  }

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await createdFeedback.save({ session: sess });
    store.feedbacks_id.push(createdFeedback);
    user.feedbacks_id.push(createdFeedback);
    await store.save({ session: sess });
    await user.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    console.log(err);
    const error = new HttpError(
      "Creating reply store failed, please try again111.",
      500
    );
    return next(error);
  }

  res.status(201).json({ success: 1, feedback: createdFeedback });
};

const getFeedbacksByUserId = async (req, res, next) => {
  const userId = req.params.id;

  let userWithFeedbacks;

  try {
    userWithFeedbacks = await User.findById(userId).populate(
      "feedbacks_id"
    );
  } catch (err) {
    const error = new HttpError("Fetching data failed, please try again!", 500);

    return next(error);
  }

  
  res.json({
    success: 1,
    feedbacks: userWithFeedbacks.feedbacks_id.map((feedback) =>
    feedback.toObject({ getters: true })
    ),
  });
};

const getFeedbacksByStoreId = async (req, res, next) => {
  const store_id = req.params.id;

  let storeWithFeedbacks;

  try {
    storeWithFeedbacks = await Store.findById(store_id).populate(
      "feedbacks_id"
    );
  } catch (err) {
    const error = new HttpError("Fetching data failed, please try again!", 500);

    return next(error);
  }

  // if (
  //   !userWithContributions ||
  //   userWithContributions.contributionsId.length === 0
  // ) {
  //   return next(
  //     new HttpError("Could not find contributions for provided user id", 404)
  //   );
  // }
  //console.log(userWithContributions);
  res.json({
    success: 1,
    feedbacks: storeWithFeedbacks.feedbacks_id.map((feedback) =>
    feedback.toObject({ getters: true })
    ),
  });
};



exports.getFeedbacks = getFeedbacks;
exports.getFeedbackById = getFeedbackById;
exports.getFeedbacksByUserId = getFeedbacksByUserId;
exports.getFeedbacksByStoreId = getFeedbacksByStoreId;

exports.createFeedback = createFeedback;
