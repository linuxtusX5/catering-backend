import mongoose from "mongoose";

const cateringPackageSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Package name is required"],
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
    serves: {
      type: Number,
      required: [true, "Number of people served is required"],
      min: [1, "Must serve at least 1 person"],
    },
    imageUrl: {
      type: String,
      trim: true,
    },
    menuItems: [
      {
        item: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "MenuItem",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: [1, "Quantity must be at least 1"],
        },
      },
    ],
    available: {
      type: Boolean,
      default: true,
    },
    packageType: {
      type: String,
      enum: [
        "Corporate",
        "Wedding",
        "Birthday",
        "Anniversary",
        "Holiday",
        "Custom",
      ],
      required: true,
    },
    minimumNotice: {
      type: Number, // in hours
      default: 24,
      min: [1, "Minimum notice must be at least 1 hour"],
    },
  },
  {
    timestamps: true,
  }
);

// Populate menu items when querying
cateringPackageSchema.pre(/^find/, function (next) {
  this.populate({
    path: "menuItems.item",
    select: "name description price category imageUrl ingredients allergens",
  });
  next();
});

export default mongoose.model("CateringPackage", cateringPackageSchema);
