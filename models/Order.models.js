import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    customerInfo: {
      name: {
        type: String,
        required: [true, "Customer name is required"],
        trim: true,
      },
      email: {
        type: String,
        required: [true, "Customer email is required"],
        lowercase: true,
        trim: true,
      },
      phone: {
        type: String,
        required: [true, "Customer phone is required"],
        trim: true,
      },
    },
    eventDetails: {
      date: {
        type: Date,
        required: [true, "Event date is required"],
        validate: {
          validator: function (date) {
            return date > new Date();
          },
          message: "Event date must be in the future",
        },
      },
      time: {
        type: String,
        required: [true, "Event time is required"],
        match: [
          /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
          "Time must be in HH:MM format",
        ],
      },
      location: {
        type: String,
        required: [true, "Event location is required"],
        trim: true,
      },
      guestCount: {
        type: Number,
        required: [true, "Guest count is required"],
        min: [1, "Must have at least 1 guest"],
      },
      eventType: {
        type: String,
        enum: [
          "Corporate",
          "Wedding",
          "Birthday",
          "Anniversary",
          "Holiday",
          "Other",
        ],
        default: "Other",
      },
    },
    items: [
      {
        menuItem: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "MenuItem",
        },
        cateringPackage: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "CateringPackage",
        },
        quantity: {
          type: Number,
          required: true,
          min: [1, "Quantity must be at least 1"],
        },
        price: {
          type: Number,
          required: true,
          min: [0, "Price must be positive"],
        },
        specialInstructions: String,
      },
    ],
    totalAmount: {
      type: Number,
      required: [true, "Total amount is required"],
      min: [0, "Total amount must be positive"],
    },
    status: {
      type: String,
      enum: [
        "pending",
        "confirmed",
        "preparing",
        "ready",
        "delivered",
        "completed",
        "cancelled",
      ],
      default: "pending",
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "refunded"],
      default: "pending",
    },
    specialRequirements: {
      type: String,
      trim: true,
    },
    deliveryInstructions: {
      type: String,
      trim: true,
    },
    orderNumber: {
      type: String,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

// Generate order number before saving
orderSchema.pre("save", async function (next) {
  if (!this.orderNumber) {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const random = Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, "0");
    this.orderNumber = `ORD${year}${month}${day}${random}`;
  }
  next();
});

// Populate references when querying
orderSchema.pre(/^find/, function (next) {
  this.populate({
    path: "items.menuItem",
    select: "name price category",
  })
    .populate({
      path: "items.cateringPackage",
      select: "name price serves",
    })
    .populate({
      path: "user",
      select: "name email",
    });
  next();
});

export default mongoose.model("Order", orderSchema);
