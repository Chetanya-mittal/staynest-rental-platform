import express from "express";
import {
  registerUser,
  loginUser,
  getMe,
  refreshAccessToken,
  logoutUser,
  logoutAll,
} from "../controllers/auth.controller.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/refresh", refreshAccessToken);
router.post("/logout", logoutUser);
router.post("/logout-all", logoutAll);
router.get("/me", protect, getMe);

export default router;
