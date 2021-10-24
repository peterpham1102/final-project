const express = require('express');
const router = express.Router();

const {check} = require('express-validator');
const foodControllers = require('../controllers/foods-controllers');
const checkAuthen = require('../middleware/check-authen');

router.get('/', foodControllers.getFoods);
router.get('/food/:id', foodControllers.getFoodById);
router.use(checkAuthen);
router.get('/store/:id', foodControllers.getFoodsByStoreId);
router.post('/', foodControllers.createFood);
router.patch('/:id', foodControllers.updateFood);

module.exports = router;