const express = require('express');
const router = express.Router();

const {check} = require('express-validator');
const foodControllers = require('../controllers/foods-controllers');
const checkAuthen = require('../middleware/check-authen');
const checkRole = require('../middleware/check-role');

router.get('/', foodControllers.getFoods);
router.use(checkAuthen);
router.get('/food/:id', foodControllers.getFoodById);

router.get('/store/:id', foodControllers.getFoodsByStoreId);
router.get('/category/:id', foodControllers.getFoodsByCategoryId);
router.post('/',
checkRole("seller"),
[
  check("name").not().isEmpty(),
  check("description").not().isEmpty(),
  check("store_id").not().isEmpty(),
  check("categories_id").not().isEmpty(),
  check("price").not().isEmpty(),
  check("image").not().isEmpty(),
  
], foodControllers.createFood);
router.patch('/:id',
checkRole("seller"),
[
  check("name").not().isEmpty(),
  check("description").not().isEmpty(),
  check("price").not().isEmpty(),
  
  
],
 foodControllers.updateFood);
router.patch('/status/:id', foodControllers.updateFoodStatus);

module.exports = router;