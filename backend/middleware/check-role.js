const jwt = require("jsonwebtoken");

const HttpError = require("../models/http-error");


const checkRole = (...permittedRole) => {
  let decodedToken;
  return (req, res, next) => {
    const token = req.headers.authorization.split(" ")[1];
    try {
      decodedToken = jwt.verify(token, "putang_ina_mo_bobo");
      req.userData = {
        userId: decodedToken.userId,
        role: decodedToken.role.toString(),
      };

      if (req.userData.role && permittedRole.includes(req.userData.role)) {
        next();
      } else {
        const error = new HttpError("You are not allowed!", 403);
        return next(error);
      }
    } catch (err) {
      const error = new HttpError("You are not allowed!", 403);
      return next(error);
    }
  };
};

module.exports = checkRole;