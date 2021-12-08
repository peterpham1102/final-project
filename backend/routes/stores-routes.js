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

router.post('/',checkRole("seller"),
  [
  check("name").not().isEmpty(),
  check("location").not().isEmpty(),
  check("description").not().isEmpty(),
  
  check("image").not().isEmpty(),
  ]
, storeControllers.createStore);
router.patch('/:id', storeControllers.updateStore);
router.patch('/status/:id', storeControllers.updateStoreStatus);

module.exports = router;