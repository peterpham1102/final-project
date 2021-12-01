const express = require('express');

const checkAuthen = require('../middleware/check-authen');
const {check} = require('express-validator');
const storeControllers = require('../controllers/stores-controllers');
const checkRole = require('../middleware/check-role');
const router = express.Router();

router.use(checkAuthen);
router.get('/', storeControllers.getStores);
router.get('/store/:id', storeControllers.getStoreById);

router.get('/user/:id', storeControllers.getStoreByUserId);
router.get('/search/:key', storeControllers.searchStoreByFoodName);

router.post('/', storeControllers.createStore);
router.patch('/:id', storeControllers.updateStore);

module.exports = router;