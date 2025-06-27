import { validationResult } from "express-validator";
import MenuItem from "../models/menuItem.models.js";

export const getAllMenuItems = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: "Validation failed",
        details: errors.array(),
      });
    }

    const { category, available, search, page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;

    // Build query
    const query = {};

    if (category) {
      query.category = category;
    }

    if (available !== undefined) {
      query.available = available;
    }

    if (search) {
      query.$text = { $search: search };
    }

    // Get total count for pagination
    const total = await MenuItem.countDocuments(query);

    // Get menu items
    const items = await MenuItem.find(query)
      .sort({ category: 1, name: 1 })
      .skip(skip)
      .limit(limit);

    res.json({
      success: true,
      items,
      pagination: {
        current_page: page,
        total_pages: Math.ceil(total / limit),
        total_items: total,
        items_per_page: limit,
      },
    });
  } catch (error) {
    console.error("Menu fetch error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch menu items",
    });
  }
};

export const getMenuCategories = async (req, res) => {
  try {
    const categories = await MenuItem.distinct("category");
    res.json({
      success: true,
      categories: categories.sort(),
    });
  } catch (error) {
    console.error("Categories fetch error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch categories",
    });
  }
};

export const getMenuItemById = async (req, res) => {
  try {
    const item = await MenuItem.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        error: "Menu item not found",
      });
    }

    res.json({
      success: true,
      item,
    });
  } catch (error) {
    console.error("Menu item fetch error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch menu item",
    });
  }
};

export const createMenuItem = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: "Validation failed",
        details: errors.array(),
      });
    }

    const itemData = {
      ...req.body,
      imageUrl: req.file ? `/uploads/${req.file.filename}` : undefined,
    };

    const item = new MenuItem(itemData);
    await item.save();

    res.status(201).json({
      success: true,
      message: "Menu item created successfully",
      item,
    });
  } catch (error) {
    console.error("Menu item creation error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to create menu item",
    });
  }
};

export const updateMenuItem = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: "Validation failed",
        details: errors.array(),
      });
    }

    const updateData = { ...req.body };

    if (req.file) {
      updateData.imageUrl = `/uploads/${req.file.filename}`;
    }

    const item = await MenuItem.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!item) {
      return res.status(404).json({
        success: false,
        error: "Menu item not found",
      });
    }

    res.json({
      success: true,
      message: "Menu item updated successfully",
      item,
    });
  } catch (error) {
    console.error("Menu item update error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to update menu item",
    });
  }
};

export const deleteMenuItem = async (req, res) => {
  try {
    const item = await MenuItem.findByIdAndDelete(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        error: "Menu item not found",
      });
    }

    res.json({
      success: true,
      message: "Menu item deleted successfully",
    });
  } catch (error) {
    console.error("Menu item deletion error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to delete menu item",
    });
  }
};
