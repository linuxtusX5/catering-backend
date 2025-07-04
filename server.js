import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import DB from "./config/database.js";

// Route imports
// import menuRoutes from "./routes/menuroutes.js";
// import customerRoutes from "./routes/customer.routes.js";
// import orderRoutes from "./routes/order.routes.js";
import authRoutes from "./routes/auth.route.js";
import menuRoutes from "./routes/menu.routes.js";

dotenv.config();
DB();

const app = express();

// Middlewares
app.use(
  cors({
    credentials: true,
  })
);
app.use(express.json());
// app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/menu", menuRoutes);
// app.use("/api/customers", customerRoutes);
// app.use("/api/orders", orderRoutes);

// Error middleware (optional cleaner)
// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).json({ message: err.message });
// });

const PORT = process.env.PORT || 5000;
//Listen
app.listen(PORT, () => {
  console.log(`Server running on ${process.env.DEV_MODE} Port ${PORT}`);
});
