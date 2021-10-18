const jwt = require("jsonwebtoken");

const HttpError = require("../models/http-error");


const checkAuthen = (req, res, next) => {
  let decodedToken;
  if (req.method === "OPTIONS") {
    return next();
  }

  try {
    const token = req.headers.authorization.split(" ")[1]; // Authorization: 'Bearer TOKEN'
    if (!token) {
      throw new Error("Authentication failed!");
    }
    decodedToken = jwt.verify(token, "putang_ina_mo_bobo");
    req.userData = {
      userId: decodedToken.userId,
      role: decodedToken.role,
      email: decodedToken.email,
      storeOwnedId: decodedToken.storeOwnedId
      
    };
    // console.log(req.userData);
    // console.log(req.userData.role);
    next();
  } catch (err) {
    console.log(err);
    const error = new HttpError("Authentication failed!", 401);
    return next(error);
  }
};

module.exports = checkAuthen;