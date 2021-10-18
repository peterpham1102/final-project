const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const HttpError = require("../models/http-error");
const mongoose = require("mongoose");
const User = require("../models/user");

const getUsers = async (req, res, next) => {
  let users;
  try {
    users = await User.find({}, "-password -image");
  } catch (err) {
    const error = new HttpError(
      "Fetching users failed, please try again later.",
      500
    );
    return next(error);
  }
  res.json({
    success: 1,
    users: users.map((user) => user.toObject({ getters: true })),
  });
};

const signup = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }

  const { name, email, phone, password, role, image } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError(
      "Signing up failed, please try again later.",
      500
    );
    return next(error);
  }

  if (existingUser) {
    const error = new HttpError(
      "User exists already, please login instead.",
      422
    );
    return next(error);
  }

  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (err) {
    const error = new HttpError(
      "Could not create user, please try again.",
      500
    );
    return next(error);
  }

  const createdUser = new User({
    name,
    email,
    phone,
    password: hashedPassword,
    role,
    image,
  });

  try {
    await createdUser.save();
  } catch (err) {
    const error = new HttpError(
      "Signing up failed, please try again later.",
      500
    );
    return next(error);
  }

  let token;
  try {
    token = jwt.sign(
      {
        userId: createdUser.id,
        email: createdUser.email,
        role: createdUser.role,
        
      },
      "putang_ina_mo_bobo",
      { expiresIn: "10h" }
    );
  } catch (err) {
    const error = new HttpError(
      "Signing up failed, please try again later.",
      500
    );
    return next(error);
  }

  res.status(201).json({
    message: "Created user",
    success: 1,
    userId: createdUser.id,
    email: createdUser.email,
    role: createdUser.role,
    token: token,
  });
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  let existingUser;

  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError(
      "Logging in failed, please try again later.",
      500
    );
    // return next(error);
    return res.json({
      success: 0,
      error: error.code,
      message: error.message,
    });
  }

  if (!existingUser) {
    const error = new HttpError(
      "Invalid credentials, could not log you in.",
      403
    );
    return res.json({
      success: 0,
      error: error.code,
      message: error.message,
    });

    // return next(error);
  }

  let isValidPassword = false;
  try {
    isValidPassword = await bcrypt.compare(password, existingUser.password);
  } catch (err) {
    const error = new HttpError(
      "Could not log you in, please check your credentials and try again.",
      500
    );
    return res.json({
      success: 0,
      error: 500,
      message:
        "Could not log you in, please check your credentials and try again.",
    });
  }

  if (!isValidPassword) {
    const error = new HttpError(
      "Invalid credentials, could not log you in.",
      403
    );
    return res.json({
      success: 0,
      error: 403,
      message: "Invalid credentials, could not log you in.",
    });
    // return next(error);
  }

  let token;
  try {
    token = jwt.sign(
      {
        userId: existingUser.id,
        email: existingUser.email,
        role: existingUser.role,
        storeOwnedId: existingUser.store_owned_id
      },
      "putang_ina_mo_bobo",
      { expiresIn: "10h" }
    );
  } catch (err) {
    const error = new HttpError(
      "Logging in failed, please try again later.",
      500
    );
    // return next(error);

    return res.json({
      success: 0,
      error: 500,
      message: "Logging in failed, please try again later.",
    });
  }


  res.json({
    message: "Login successfully",
    userId: existingUser.id,
    email: existingUser.email,
    role: existingUser.role,
    token: token,
    storeOwnedId: existingUser.store_owned_id,
    success: 1,
  });
};


const getUserById = async (req, res, next) => {
  const userId = req.params.id;
  let user;
  try {
    user = await User.findById(userId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not find an user!",
      500
    );
    return next(error);
  }
  if (!user) {
    const error = new HttpError(
      "Could not find an user for the provided id!",
      404
    );
    return next(error);
  }
  res.json({ success: 1, user: user.toObject({ getters: true }) });
};


const updateUser = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new HttpError("Invalid inputs, please try again!", 422);
  }
  const {
    name,
    phone,
    // image
  } = req.body;
  const userId = req.params.id;
  let user;
  try {
    user = await User.findById(userId);
  } catch (err) {
    const error = HttpError("Something went wrong, could not update user", 500);
    return next(error);
  }
  user.name = name;
  user.phone = phone;
  // user.image = image;

  try {
    await user.save();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not update user",
      500
    );
    return next(error);
  }
  res.status(200).json({ 
    success: 1,
    user: user.toObject({ getters: true }) });
};

exports.getUsers = getUsers;
exports.getUserById = getUserById;
exports.signup = signup;
exports.login = login;
exports.updateUser = updateUser;

