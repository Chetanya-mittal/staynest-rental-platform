import express from "express";
import {
  getAllProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty,
  getMyProperties,
} from "../controllers/property.controller.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getAllProperties);
router.post("/", protect, createProperty);
router.get("/my", protect, getMyProperties);

router.get("/:id", getPropertyById);
router.put("/:id", protect, updateProperty);
router.delete("/:id", protect, deleteProperty);

export default router;
