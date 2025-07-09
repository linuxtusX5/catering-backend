import express from "express";
import { body, query } from "express-validator";
import {
  authenticateToken,
  requireAdmin,
  optionalAuth,
} from "../middleware/authMiddleware.js";
import {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrderStatus,
  deleteOrder,
  getOrderStats,
} from "../controllers/order.controller.js";

const router = express.Router();

// Get orders (Admin gets all, users get their own)
router.get(
  "/",
  authenticateToken,
  [
    query("status")
      .optional()
      .isIn([
        "pending",
        "confirmed",
        "preparing",
        "ready",
        "delivered",
        "completed",
        "cancelled",
      ]),
    query("page").optional().isInt({ min: 1 }).toInt(),
    query("limit").optional().isInt({ min: 1, max: 100 }).toInt(),
  ],
  getAllOrders
);

// Get single order
router.get("/:id", authenticateToken, getOrderById);

// Create new order
router.post(
  "/",
  optionalAuth,
  [
    body("customerInfo.name")
      .trim()
      .notEmpty()
      .withMessage("Customer name is required"),
    body("customerInfo.email")
      .isEmail()
      .normalizeEmail()
      .withMessage("Valid email is required"),
    body("customerInfo.phone")
      .isMobilePhone()
      .withMessage("Valid phone number is required"),
    body("eventDetails.date")
      .isISO8601()
      .withMessage("Valid event date is required"),
    body("eventDetails.time")
      .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
      .withMessage("Valid event time is required (HH:MM format)"),
    body("eventDetails.location")
      .trim()
      .notEmpty()
      .withMessage("Event location is required"),
    body("eventDetails.guestCount")
      .isInt({ min: 1 })
      .withMessage("Guest count must be a positive integer"),
    body("eventDetails.eventType")
      .optional()
      .isIn([
        "Corporate",
        "Wedding",
        "Birthday",
        "Anniversary",
        "Holiday",
        "Other",
      ]),
    body("items")
      .isArray({ min: 1 })
      .withMessage("At least one item must be ordered"),
    body("items.*.quantity")
      .isInt({ min: 1 })
      .withMessage("Quantity must be a positive integer"),
    body("items.*.price")
      .isFloat({ min: 0 })
      .withMessage("Price must be a positive number"),
    body("totalAmount")
      .isFloat({ min: 0 })
      .withMessage("Total amount must be a positive number"),
    body("specialRequirements").optional().trim(),
    body("deliveryInstructions").optional().trim(),
  ],
  createOrder
);

// Update order status (Admin only)
router.put(
  "/:id/status",
  authenticateToken,
  requireAdmin,
  [
    body("status")
      .isIn([
        "pending",
        "confirmed",
        "preparing",
        "ready",
        "delivered",
        "completed",
        "cancelled",
      ])
      .withMessage("Invalid status"),
  ],
  updateOrderStatus
);

// Delete order (Admin only)
router.delete("/:id", authenticateToken, requireAdmin, deleteOrder);

// Get order statistics (Admin only)
router.get("/stats/overview", authenticateToken, requireAdmin, getOrderStats);

export default router;
