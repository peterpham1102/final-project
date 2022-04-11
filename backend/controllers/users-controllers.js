const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const HttpError = require("../models/http-error");
const mongoose = require("mongoose");
const User = require("../models/user");

const getUsers = async (req, res, next) => {
  let users;
  try {
    users = await User.find({role : {$ne: 'admin'}}, "-password").sort({created_at: -1 });
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
        // storeOwnedId: existingUser.store_owned_id
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
    // storeOwnedId: existingUser.store_owned_id,
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

const updateUserStatus = async (req, res, next) => {
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
const exportUsers = async(req, res, next) => {
  const userId = req.userData.userId;
  const role = req.userData.role;

  let exportedUsers;
  try {
    if(role === 'admin' && userId) {
      exportedUsers = await User.find({role: ['seller', 'buyer', 'shipper']}).select({
        "id": 1,
        "name": 1,
        "email": 1,
        "password": 1,
        "phone": 1,
        "role": 1,
        "image": 1,
        "store_owned_id": 1,
        "orders_placed_id": 1,
        "orders_shipped_id": 1,
        "feedbacks_id": 1,
        
      })
    } else {
      const error = new HttpError('You are not allowed to export data', 403);
      return next(error);
    }
  } catch(err) {
    const error = new HttpError('Something went wrong, could not export data', 500);
      return next(error);
  }
  res.json({
    success: 1,
    exportedUsers: exportedUsers.map((user) =>
      user.toObject()
    ),
  })
};

const importUsers = async (req, res, next) => {
  const userId = req.userData.userId;
  const role = req.userData.role;

  let importedUsers = [];
  try {
    if (role === "admin" && userId) {
      console.log(req.body);
      console.log(req.body.length);
      console.log(req.body[0].id);
      
      await req.body.forEach(async element => {
        const newId = mongoose.Types.ObjectId(element._id);
        console.log(newId);
        
         let importResult = await User.create([
          {
            _id: newId,
            name: element.name,
            email: element.email,
            password: element.password,
            phone: element.phone,
            role: element.role,
            image: element.image,
            store_owned_id: element.store_owned_id,
            orders_placed_id: element.orders_placed_id,
            orders_shipped_id: element.orders_shipped_id,
            feedbacks_id: element.feedbacks_id,
            
                
          },
        ]).catch(()=>{res.json({
          success: 0,
          message: 'Something went wrong, could not import data'
        })});
        console.log(importResult);
        importedUsers.push(importResult);
        if (req.body.length === importedUsers.length) {
          res.json({
            success: 1,
            message: "Import successfully",
            importedUsers: importedUsers
          });  
        }
      });    
    } else {
      const error = new HttpError("You are not allowed to import data", 403);
      return next(error);
    }
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not import data",
      500
    );
    return next(error);
  } 
};

exports.getUsers = getUsers;
exports.getUserById = getUserById;
exports.signup = signup;
exports.login = login;
exports.updateUser = updateUser;
exports.exportUsers = exportUsers;
exports.importUsers = importUsers;

