import { validationResult } from "express-validator";
import CateringPackage from "../models/cateringPackage.models.js";

export const getAllPackages = async (req, res) => {
  try {
    const packages = await CateringPackage.find({ available: true }).sort({
      serves: 1,
      price: 1,
    });

    res.json({
      success: true,
      packages,
    });
  } catch (error) {
    console.error("Packages fetch error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch catering packages",
    });
  }
};
export const getPackageById = async (req, res) => {
  try {
    const cateringPackage = await CateringPackage.findById(req.params.id);

    if (!cateringPackage) {
      return res.status(404).json({
        success: false,
        error: "Catering package not found",
      });
    }

    res.json({
      success: true,
      package: cateringPackage,
    });
  } catch (error) {
    console.error("Package fetch error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch catering package",
    });
  }
};

export const createPackage = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: "Validation failed",
        details: errors.array(),
      });
    }

    const packageData = {
      ...req.body,
      imageUrl: req.file ? `/uploads/${req.file.filename}` : undefined,
    };

    const cateringPackage = new CateringPackage(packageData);
    await cateringPackage.save();

    res.status(201).json({
      success: true,
      message: "Catering package created successfully",
      package: cateringPackage,
    });
  } catch (error) {
    console.error("Package creation error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to create catering package",
    });
  }
};

export const updatePackage = async (req, res) => {
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

    const cateringPackage = await CateringPackage.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!cateringPackage) {
      return res.status(404).json({
        success: false,
        error: "Catering package not found",
      });
    }

    res.json({
      success: true,
      message: "Catering package updated successfully",
      package: cateringPackage,
    });
  } catch (error) {
    console.error("Package update error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to update catering package",
    });
  }
};
