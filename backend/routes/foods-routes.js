const express = require('express');
const router = express.Router();

const {check} = require('express-validator');
const foodControllers = require('../controllers/foods-controllers');
const checkAuthen = require('../middleware/check-authen');

router.get('/', foodControllers.getFoods);
router.post('/', foodControllers.createFood);
router.patch('/:id', foodControllers.updateFood);

module.exports = router;