const express = require("express");

const { check } = require("express-validator");
const categoryControllers = require("../controllers/categories-controllers");
const checkRole = require('../middleware/check-role');
const checkAuthen = require('../middleware/check-authen');
const router = express.Router();

router.get("/", categoryControllers.getCategories);
router.get("/:id", categoryControllers.getCategoryById);

router.use(checkAuthen);
router.post(
  "/", checkRole('admin'),
  [
    check("name")
    .not()
    .isEmpty(),
     check("description")
     .not()
     .isEmpty()],
  categoryControllers.createCategory
);

router.patch(
  "/:id", checkRole('admin'),
  [
    check("name")
    .not()
    .isEmpty(),
     check("description")
     .not()
     .isEmpty()],
  categoryControllers.updateCategory
);

router.delete("/:id",checkRole('admin'), categoryControllers.deleteCategory);

module.exports = router;