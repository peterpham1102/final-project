const express = require("express");
const usersController = require("../controllers/users-controllers");

const router = express.Router();

router.post("/login", usersController.login);

router.get("/", usersController.getUsers);
router.post(
  "/signup", usersController.signup);


  module.exports = router;