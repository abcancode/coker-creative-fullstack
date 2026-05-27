import express from "express";

import {
  registerAdmin,
  loginAdmin,
  forgotPassword,
  resetPassword,
} from "../controllers/authController.js";

const router = express.Router();

// REGISTER
router.post("/register", registerAdmin);

// LOGIN
router.post("/login", loginAdmin);

// FORGOT PASSWORD
router.post("/forgot-password", forgotPassword);

// RESET PASSWORD
router.post("/reset-password/:token", resetPassword);

export default router;
