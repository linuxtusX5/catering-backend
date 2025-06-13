import express from "express";
const router = express.Router();
import { getCustomers } from "../controllers/customerController.js";

router.get("/", getCustomers);

export default router;
