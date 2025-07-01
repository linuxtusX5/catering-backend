import express from "express";
import { body, query } from "express-validator";
import {
  authenticateToken,
  requireAdmin,
} from "../middleware/authMiddleware.js";
import { parseJsonFields } from "../middleware/parseJsonFields.js";
import { upload } from "../middleware/upload.js";
import {
  getAllMenuItems,
  getMenuCategories,
  getMenuItemById,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
} from "../controllers/menu.controller.js";

const router = express.Router();

// Get all menu items with optional filtering
router.get(
  "/",
  [
    query("category").optional().trim(),
    query("available").optional().isBoolean().toBoolean(),
    query("search").optional().trim(),
    query("page").optional().isInt({ min: 1 }).toInt(),
    query("limit").optional().isInt({ min: 1, max: 100 }).toInt(),
  ],
  getAllMenuItems
);

// Get menu categories
router.get("/categories", getMenuCategories);

// Get single menu item
router.get("/:id", getMenuItemById);

// Create new menu item (Admin only)
// router.post(
//   "/",
//   authenticateToken,
//   requireAdmin,
//   upload.single("image"),
//   [
//     body("name").trim().notEmpty().withMessage("Name is required"),
//     body("description")
//       .trim()
//       .notEmpty()
//       .withMessage("Description is required"),
//     body("price")
//       .isFloat({ min: 0 })
//       .withMessage("Price must be a positive number"),
//     body("category").trim().notEmpty().withMessage("Category is required"),
//     body("ingredients")
//       .optional()
//       .isArray()
//       .withMessage("Ingredients must be an array"),
//     body("allergens")
//       .optional()
//       .isArray()
//       .withMessage("Allergens must be an array"),
//     body("preparationTime")
//       .optional()
//       .isInt({ min: 1 })
//       .withMessage("Preparation time must be a positive integer"),
//     body("spiceLevel")
//       .optional()
//       .isIn(["Mild", "Medium", "Hot", "Extra Hot"])
//       .withMessage("Invalid spice level"),
//   ],
//   createMenuItem
// );

router.post(
  "/",
  authenticateToken,
  requireAdmin,
  upload.single("image"),
  parseJsonFields, // 🔁 Must come before validation
  [
    body("name").trim().notEmpty().withMessage("Name is required"),
    body("description")
      .trim()
      .notEmpty()
      .withMessage("Description is required"),
    body("price")
      .isFloat({ min: 0 })
      .withMessage("Price must be a positive number"),
    body("category").trim().notEmpty().withMessage("Category is required"),
    body("ingredients")
      .optional()
      .isArray()
      .withMessage("Ingredients must be an array"),
    body("allergens")
      .optional()
      .isArray()
      .withMessage("Allergens must be an array"),
    body("preparationTime")
      .optional()
      .isInt({ min: 1 })
      .withMessage("Preparation time must be a positive integer"),
    body("spiceLevel")
      .optional()
      .isIn(["Mild", "Medium", "Hot", "Extra Hot"])
      .withMessage("Invalid spice level"),
  ],
  createMenuItem
);

// Update menu item (Admin only)
router.put(
  "/:id",
  authenticateToken,
  requireAdmin,
  upload.single("image"),
  [
    body("name")
      .optional()
      .trim()
      .notEmpty()
      .withMessage("Name cannot be empty"),
    body("description")
      .optional()
      .trim()
      .notEmpty()
      .withMessage("Description cannot be empty"),
    body("price")
      .optional()
      .isFloat({ min: 0 })
      .withMessage("Price must be a positive number"),
    body("category")
      .optional()
      .trim()
      .notEmpty()
      .withMessage("Category cannot be empty"),
    body("available").optional().isBoolean().toBoolean(),
    body("ingredients")
      .optional()
      .isArray()
      .withMessage("Ingredients must be an array"),
    body("allergens")
      .optional()
      .isArray()
      .withMessage("Allergens must be an array"),
    body("preparationTime")
      .optional()
      .isInt({ min: 1 })
      .withMessage("Preparation time must be a positive integer"),
    body("spiceLevel")
      .optional()
      .isIn(["Mild", "Medium", "Hot", "Extra Hot"])
      .withMessage("Invalid spice level"),
  ],
  updateMenuItem
);

// Delete menu item (Admin only)
router.delete("/:id", authenticateToken, requireAdmin, deleteMenuItem);

export default router;
