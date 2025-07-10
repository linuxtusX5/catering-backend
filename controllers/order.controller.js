import { validationResult } from "express-validator";
import Order from "../models/Order.models.js";

export const getAllOrders = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: "Validation failed",
        details: errors.array(),
      });
    }

    const { status, page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;

    // Build query
    const query = {};

    // Non-admin users can only see their own orders
    if (req.user.role !== "admin") {
      query.user = req.user._id;
    }

    if (status) {
      query.status = status;
    }

    // Get total count for pagination
    const total = await Order.countDocuments(query);

    // Get orders
    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      success: true,
      orders,
      pagination: {
        current_page: page,
        total_pages: Math.ceil(total / limit),
        total_items: total,
        items_per_page: limit,
      },
    });
  } catch (error) {
    console.error("Orders fetch error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch orders",
    });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const query = { _id: req.params.id };

    // Non-admin users can only see their own orders
    if (req.user.role !== "admin") {
      query.user = req.user._id;
    }

    const order = await Order.findOne(query);

    if (!order) {
      return res.status(404).json({
        success: false,
        error: "Order not found",
      });
    }

    res.json({
      success: true,
      order,
    });
  } catch (error) {
    console.error("Order fetch error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch order",
    });
  }
};

export const createOrder = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: "Validation failed",
        details: errors.array(),
      });
    }

    const orderData = {
      ...req.body,
      user: req.user ? req.user._id : undefined,
    };

    const order = new Order(orderData);
    await order.save();

    res.status(201).json({
      success: true,
      message: "Order created successfully",
      order,
    });
  } catch (error) {
    console.error("Order creation error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to create order",
    });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: "Validation failed",
        details: errors.array(),
      });
    }

    const { status } = req.body;

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        error: "Order not found",
      });
    }

    res.json({
      success: true,
      message: "Order status updated successfully",
      order,
    });
  } catch (error) {
    console.error("Order status update error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to update order status",
    });
  }
};

export const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        error: "Order not found",
      });
    }

    res.json({
      success: true,
      message: "Order deleted successfully",
    });
  } catch (error) {
    console.error("Order deletion error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to delete order",
    });
  }
};

export const getOrderStats = async (req, res) => {
  try {
    const [
      totalOrders,
      pendingOrders,
      completedOrders,
      totalRevenue,
      avgOrderValue,
    ] = await Promise.all([
      Order.countDocuments(),
      Order.countDocuments({ status: "pending" }),
      Order.countDocuments({ status: "completed" }),
      Order.aggregate([
        { $match: { status: "completed" } },
        { $group: { _id: null, total: { $sum: "$totalAmount" } } },
      ]),
      Order.aggregate([
        { $group: { _id: null, avg: { $avg: "$totalAmount" } } },
      ]),
    ]);

    res.json({
      success: true,
      stats: {
        total_orders: totalOrders,
        pending_orders: pendingOrders,
        completed_orders: completedOrders,
        total_revenue: totalRevenue[0]?.total || 0,
        avg_order_value: avgOrderValue[0]?.avg || 0,
      },
    });
  } catch (error) {
    console.error("Order stats error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch order statistics",
    });
  }
};
