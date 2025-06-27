import mongoose from "mongoose";

const menuItemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Menu item name is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price must be positive"],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true,
      enum: [
        "Appetizers",
        "Main Course",
        "Salads",
        "Desserts",
        "Beverages",
        "Vegetarian",
        "Vegan",
        "Gluten-Free",
      ],
    },
    imageUrl: {
      type: String,
      trim: true,
    },
    ingredients: [
      {
        type: String,
        trim: true,
      },
    ],
    allergens: [
      {
        type: String,
        trim: true,
        enum: [
          "Dairy",
          "Eggs",
          "Fish",
          "Shellfish",
          "Tree Nuts",
          "Peanuts",
          "Wheat",
          "Soy",
          "Sesame",
        ],
      },
    ],
    available: {
      type: Boolean,
      default: true,
    },
    nutritionalInfo: {
      calories: Number,
      protein: Number,
      carbs: Number,
      fat: Number,
      fiber: Number,
    },
    preparationTime: {
      type: Number, // in minutes
      min: [1, "Preparation time must be at least 1 minute"],
    },
    spiceLevel: {
      type: String,
      enum: ["Mild", "Medium", "Hot", "Extra Hot"],
      default: "Mild",
    },
  },
  {
    timestamps: true,
  }
);

// Index for better search performance
menuItemSchema.index({ category: 1, available: 1 });
menuItemSchema.index({ name: "text", description: "text" });

export default mongoose.model("MenuItem", menuItemSchema);
