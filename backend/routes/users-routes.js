const express = require('express');
const usersController = require('../controllers/users-controllers');
const checkAuthen = require('../middleware/check-authen')
const checkRole = require('../middleware/check-role');
const router = express.Router();
const {check} = require('express-validator');



router.post('/login', usersController.login);

router.get('/', usersController.getUsers);
router.post('/signup',
[
  check("name").not().isEmpty(),
    check("email").normalizeEmail().isEmail(),
    check("phone").not().isEmpty(),
    check("role").not().isEmpty(),
    check("password").isLength({ min: 6 }),
], usersController.signup);
router.use(checkAuthen)

router.get("/user/:id", usersController.getUserById);

router.get("/verify", checkAuthen, async (req, res) => {
  res.send({ success: 1, data: req.userData });
});

router.patch(
  "/:id",
  
  usersController.updateUser
);

router.get("/export", usersController.exportUsers);
module.exports = router;
