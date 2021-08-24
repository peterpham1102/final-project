const express = require("express");

const { check } = require("express-validator");
const categoryControllers = require("../controllers/categories-controllers");

const router = express.Router();

router.get("/", categoryControllers.getCategories);
router.get("/:id", categoryControllers.getCategoryById);

router.post(
  "/",
  [check("name").not().isEmpty(), check("description").not().isEmpty()],
  categoryControllers.createCategory
);

router.patch(
  "/:id",
  [check("name").not().isEmpty(), check("description").not().isEmpty()],
  categoryControllers.updateCategory
);

router.delete("/:id", categoryControllers.deleteCategory);

module.exports = router;