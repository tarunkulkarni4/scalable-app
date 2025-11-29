// routes/authRoutes.js
const express = require("express");
const router = express.Router();
const {
  register,
  login,
  getMe,
} = require("../controllers/authController.js");
const { protect } = require("../middleware/authMiddleware.js");

// Public routes
router.post("/register", register);
router.post("/login", login);

// Protected route
router.get("/me", protect, getMe);

module.exports = router;
