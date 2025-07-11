import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import DB from "./config/database.js";
import orderRoutes from "./routes/order.routes.js";
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

// Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/menu", menuRoutes);
// app.use("/api/customers", customerRoutes);
app.use("/api/v1/orders", orderRoutes);

const PORT = process.env.PORT || 5000;
//Listen
app.listen(PORT, () => {
  console.log(`Server running on ${process.env.DEV_MODE} Port ${PORT}`);
});
