const express = require('express');
const router = express.Router();

const {check} = require('express-validator');
const orderControllers = require('../controllers/orders-controllers');
const checkAuthen = require('../middleware/check-authen');


router.get('/', orderControllers.getOrders);
router.use(checkAuthen);
router.post('/', orderControllers.createOrder);
// router.patch('/:id', orderControllers.updateOrder);

module.exports = router;