const express = require('express');
const router = express.Router();

const {check} = require('express-validator');
const shippingControllers = require('../controllers/shippings-controllers');
const checkAuthen = require('../middleware/check-authen');
const checkRole = require('../middleware/check-role');

router.get('/', shippingControllers.getShippings);
router.use(checkAuthen);

router.get('/user/:id', shippingControllers.getShippingByUserId);


router.post('/', shippingControllers.createShipping);
// router.patch('/:id', shippingControllers.updateShipping);

module.exports = router;