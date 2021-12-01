const express = require('express');
const usersController = require('../controllers/users-controllers');
const checkAuthen = require('../middleware/check-authen')
const checkRole = require('../middleware/check-role');
const router = express.Router();



router.post('/login', usersController.login);

router.get('/', usersController.getUsers);
router.post('/signup', usersController.signup);
router.use(checkAuthen)

router.get("/user/:id", usersController.getUserById);

router.get("/verify", checkAuthen, async (req, res) => {
  res.send({ success: 1, data: req.userData });
});

router.patch(
  "/:id",
  
  usersController.updateUser
);

module.exports = router;
