import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import DB from "./config/database.js";

// Route imports
import menuRoutes from "./routes/menu.routes.js";
// import customerRoutes from "./routes/customer.routes.js";
// import orderRoutes from "./routes/order.routes.js";
import UserRoutes from "./routes/user.route.js";

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
app.use("/api/users", UserRoutes);
app.use("/api/menu", menuRoutes);
// app.use("/api/customers", customerRoutes);
// app.use("/api/orders", orderRoutes);

// Error middleware (optional cleaner)
// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).json({ message: err.message });
// });

const PORT = process.env.PORT || 4000;
//Listen
app.listen(PORT, () => {
  console.log(`Server running on ${process.env.DEV_MODE} Port ${PORT}`);
});
