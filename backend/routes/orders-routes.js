const express = require('express');
const router = express.Router();

const {check} = require('express-validator');
const orderControllers = require('../controllers/orders-controllers');
const checkAuthen = require('../middleware/check-authen');
const checkRole = require('../middleware/check-role');

router.get('/', orderControllers.getOrders);
router.use(checkAuthen);
router.get('/store/:id', orderControllers.getOrdersByStoreId);
router.get('/status/processing', orderControllers.getProcessingOrders);
router.get('/user/:id', orderControllers.getOrderByUserId);
router.get('/user/shipper/:id', orderControllers.getOrderByShipperId);

router.patch('/status/:id', orderControllers.updateOrderStatus);

router.post('/', orderControllers.createOrder);
// router.patch('/:id', orderControllers.updateOrder);

module.exports = router;