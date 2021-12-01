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
router.post('/', foodControllers.createFood);
router.patch('/:id', foodControllers.updateFood);

module.exports = router;