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
