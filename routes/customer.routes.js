import express from "express";
const router = express.Router();
import { getCustomers } from "../controllers/customer.controller.js";

router.get("/", getCustomers);

export default router;
