import { getMenuItems, createMenuItem } from "../controllers/menucontroller.js";
import express from "express";
const router = express.Router();

router.get("/", getMenuItems);
router.post("/", createMenuItem);

export default router;
